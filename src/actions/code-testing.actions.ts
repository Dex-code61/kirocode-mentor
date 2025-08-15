'use server';

import { actionClient } from '@/lib/safe-action';
import { getServerSession } from '@/lib/auth-server';
import prisma from '@/lib/prisma';
import z from 'zod';
import { 
  executeCodeWithTests, 
  validateUserCode,
} from '@/services/code-execution.service';
import { 
  TestConfiguration,
  CodeExecutionResult,
  SubmissionData,
  UserProgressStats 
} from '@/types/code-testing.types';

const testCodeSchema = z.object({
  challengeId: z.string().min(1, 'Challenge ID is required'),
  code: z.string().min(1, 'Code is required'),
});

const submitCodeSchema = z.object({
  challengeId: z.string().min(1, 'Challenge ID is required'),
  code: z.string().min(1, 'Code is required'),
  testResults: z.any().optional(),
});

const getSubmissionSchema = z.object({
  challengeId: z.string().min(1, 'Challenge ID is required'),
});

/**
 * Action pour tester le code utilisateur avec les tests unitaires
 */
export const testUserCode = actionClient
  .inputSchema(testCodeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      // Récupérer le challenge avec ses tests
      const challenge = await prisma.challenge.findUnique({
        where: { id: parsedInput.challengeId },
        select: {
          id: true,
          unitTests: true,
          testFramework: true,
          testTimeout: true,
          testSetup: true,
          testTeardown: true,
          allowedImports: true,
          memoryLimit: true,
          timeLimit: true,
          requirements: true,
        },
      });

      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Extraire le langage des requirements
      let language = 'javascript';
      let programmingLanguage: 'JAVASCRIPT' | 'TYPESCRIPT' | 'PYTHON' | 'JAVA' | 'CPP' | 'RUST' | 'GO' = 'JAVASCRIPT';
      
      try {
        const requirements = typeof challenge.requirements === 'string' 
          ? JSON.parse(challenge.requirements) 
          : challenge.requirements;
        language = requirements?.language || 'javascript';
        
        // Mapper vers l'enum ProgrammingLanguage
        const languageMap: Record<string, typeof programmingLanguage> = {
          'javascript': 'JAVASCRIPT',
          'typescript': 'TYPESCRIPT',
          'python': 'PYTHON',
          'java': 'JAVA',
          'cpp': 'CPP',
          'c++': 'CPP',
          'rust': 'RUST',
          'go': 'GO',
        };
        
        programmingLanguage = languageMap[language.toLowerCase()] || 'JAVASCRIPT';
      } catch (e) {
        console.warn('Failed to parse requirements for language:', e);
      }

      // Valider le code utilisateur
      const validation = validateUserCode(parsedInput.code, language);
      if (!validation.valid) {
        return {
          success: false,
          error: `Code validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Configuration des tests
      const testConfig: TestConfiguration = {
        framework: challenge.testFramework as any,
        timeout: challenge.testTimeout || 5000,
        memoryLimit: challenge.memoryLimit || 128,
        timeLimit: challenge.timeLimit || 10,
        allowedImports: challenge.allowedImports || [],
        setup: challenge.testSetup || undefined,
        teardown: challenge.testTeardown || undefined,
      };

      // Exécuter les tests
      const result = await executeCodeWithTests(
        parsedInput.code,
        challenge.unitTests || '',
        language,
        testConfig
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Error testing user code:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

/**
 * Action pour soumettre le code utilisateur
 */
export const submitUserCode = actionClient
  .inputSchema(submitCodeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      // Récupérer le challenge
      const challenge = await prisma.challenge.findUnique({
        where: { id: parsedInput.challengeId },
        select: {
          id: true,
          points: true,
          unitTests: true,
          testFramework: true,
          requirements: true,
        },
      });

      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Extraire le langage des requirements
      let programmingLanguage: 'JAVASCRIPT' | 'TYPESCRIPT' | 'PYTHON' | 'JAVA' | 'CPP' | 'RUST' | 'GO' = 'JAVASCRIPT';
      
      try {
        const requirements = typeof challenge.requirements === 'string' 
          ? JSON.parse(challenge.requirements) 
          : challenge.requirements;
        const language = requirements?.language || 'javascript';
        
        // Mapper vers l'enum ProgrammingLanguage
        const languageMap: Record<string, typeof programmingLanguage> = {
          'javascript': 'JAVASCRIPT',
          'typescript': 'TYPESCRIPT',
          'python': 'PYTHON',
          'java': 'JAVA',
          'cpp': 'CPP',
          'c++': 'CPP',
          'rust': 'RUST',
          'go': 'GO',
        };
        
        programmingLanguage = languageMap[language.toLowerCase()] || 'JAVASCRIPT';
      } catch (e) {
        console.warn('Failed to parse requirements for language:', e);
      }

      // Si des tests unitaires existent, les exécuter d'abord
      let testResults: CodeExecutionResult | undefined;
      if (challenge.unitTests) {
        // Ici, on devrait exécuter les tests réels
        // Pour l'instant, on simule
        testResults = parsedInput.testResults;
      }

      // Calculer le score basé sur les résultats des tests
      let score = 0;
      let status: 'PENDING' | 'COMPLETED' | 'FAILED' = 'PENDING';

      if (testResults) {
        const passedTests = testResults.testResults?.filter(t => t.passed).length || 0;
        const totalTests = testResults.testResults?.length || 1;
        score = (passedTests / totalTests) * 100;
        status = score >= 70 ? 'COMPLETED' : 'FAILED';
      } else {
        // Sans tests, on considère comme réussi
        score = 85;
        status = 'COMPLETED';
      }

      // Vérifier s'il existe déjà une soumission
      const existingSubmission = await prisma.codeSubmission.findFirst({
        where: {
          userId: session.user.id,
          challengeId: parsedInput.challengeId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      let submission;
      if (existingSubmission) {
        // Mettre à jour la soumission existante
        submission = await prisma.codeSubmission.update({
          where: {
            id: existingSubmission.id,
          },
          data: {
            code: parsedInput.code,
            status: status as any,
            score,
            testResults: testResults ? JSON.stringify(testResults) : null,
            attempts: existingSubmission.attempts + 1,
            updatedAt: new Date(),
          },
        });
      } else {
        // Créer une nouvelle soumission
        submission = await prisma.codeSubmission.create({
          data: {
            userId: session.user.id,
            challengeId: parsedInput.challengeId,
            code: parsedInput.code,
            language: programmingLanguage,
            status: status as any,
            score,
            testResults: testResults ? JSON.stringify(testResults) : null,
            attempts: 1,
          },
        });
      }

      return {
        success: status === 'COMPLETED',
        message: status === 'COMPLETED' 
          ? `Great job! Your solution scored ${Math.round(score)}%.`
          : `Your solution scored ${Math.round(score)}%. Keep trying to improve!`,
        data: {
          submissionId: submission.id,
          score,
          status,
          testResults,
        },
      };
    } catch (error) {
      console.error('Error submitting user code:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
/**

 * Action pour récupérer les soumissions d'un utilisateur pour un challenge
 */
export const getUserSubmissions = actionClient
  .inputSchema(getSubmissionSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      // Récupérer toutes les soumissions de l'utilisateur pour ce challenge
      const submissions = await prisma.codeSubmission.findMany({
        where: {
          userId: session.user.id,
          challengeId: parsedInput.challengeId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          code: true,
          language: true,
          score: true,
          status: true,
          attempts: true,
          testResults: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Parser les testResults JSON
      const formattedSubmissions = submissions.map(submission => ({
        ...submission,
        testResults: submission.testResults 
          ? JSON.parse(submission.testResults as string)
          : null,
      }));

      return {
        success: true,
        data: formattedSubmissions,
      };
    } catch (error) {
      console.error('Error getting user submissions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

/**
 * Action pour récupérer la meilleure soumission d'un utilisateur pour un challenge
 */
export const getBestSubmission = actionClient
  .inputSchema(getSubmissionSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      // Récupérer la meilleure soumission (score le plus élevé)
      const bestSubmission = await prisma.codeSubmission.findFirst({
        where: {
          userId: session.user.id,
          challengeId: parsedInput.challengeId,
        },
        orderBy: [
          { score: 'desc' },
          { createdAt: 'desc' },
        ],
        select: {
          id: true,
          code: true,
          language: true,
          score: true,
          status: true,
          attempts: true,
          testResults: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!bestSubmission) {
        return {
          success: true,
          data: null,
        };
      }

      // Parser les testResults JSON
      const formattedSubmission = {
        ...bestSubmission,
        testResults: bestSubmission.testResults 
          ? JSON.parse(bestSubmission.testResults as string)
          : null,
      };

      return {
        success: true,
        data: formattedSubmission,
      };
    } catch (error) {
      console.error('Error getting best submission:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });/**
 * Acti
on pour récupérer les statistiques de progression d'un utilisateur
 */
export const getUserProgressStats = actionClient
  .inputSchema(z.object({}))
  .action(async () => {
    try {
      const session = await getServerSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      // Récupérer les statistiques des soumissions
      const submissions = await prisma.codeSubmission.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
          challengeId: true,
          score: true,
          status: true,
          language: true,
          createdAt: true,
          challenge: {
            select: {
              title: true,
              type: true,
              points: true,
            },
          },
        },
      });

      // Calculer les statistiques
      const totalSubmissions = submissions.length;
      const completedChallenges = new Set(
        submissions
          .filter(s => s.status === 'COMPLETED')
          .map(s => s.challengeId)
      ).size;
      
      const totalChallenges = new Set(submissions.map(s => s.challengeId)).size;
      const averageScore = submissions.length > 0 
        ? submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length
        : 0;

      // Statistiques par langage
      const languageStats = submissions.reduce((acc, submission) => {
        const lang = submission.language;
        if (!acc[lang]) {
          acc[lang] = { count: 0, completed: 0, averageScore: 0, totalScore: 0 };
        }
        acc[lang].count++;
        acc[lang].totalScore += submission.score || 0;
        if (submission.status === 'COMPLETED') {
          acc[lang].completed++;
        }
        return acc;
      }, {} as Record<string, { count: number; completed: number; averageScore: number; totalScore: number }>);

      // Calculer la moyenne par langage
      Object.keys(languageStats).forEach(lang => {
        languageStats[lang].averageScore = languageStats[lang].totalScore / languageStats[lang].count;
      });

      // Progression récente (derniers 7 jours)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentSubmissions = submissions.filter(
        s => new Date(s.createdAt) >= sevenDaysAgo
      );

      return {
        success: true,
        data: {
          totalSubmissions,
          completedChallenges,
          totalChallenges,
          completionRate: totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0,
          averageScore: Math.round(averageScore),
          languageStats,
          recentActivity: {
            submissionsLastWeek: recentSubmissions.length,
            completedLastWeek: recentSubmissions.filter(s => s.status === 'COMPLETED').length,
          },
        },
      };
    } catch (error) {
      console.error('Error getting user progress stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });