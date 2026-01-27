import { FormData } from '@/types/form';
import { GeneratedDocument } from '@/types/document';
import { logger } from '@/lib/logger';

/**
 * AI service for generating immigration letters
 * Atomic service - single responsibility
 */

interface GenerateLetterResult {
  success: boolean;
  document?: GeneratedDocument;
  error?: string;
}

/**
 * Build the AI prompt from form data
 */
function buildPrompt(formData: FormData): string {
  const { aboutYou, applicationContext, explanation, tone, emphasis } = formData;

  let toneInstruction = '';
  if (tone === 'formal') {
    toneInstruction = 'Use formal, professional language throughout.';
  } else if (tone === 'neutral') {
    toneInstruction = 'Use clear, balanced language that is professional but not overly formal.';
  } else {
    toneInstruction = 'Use warm, personal language while maintaining professionalism.';
  }

  return `You are an expert immigration document writer. Generate a professional Letter of Explanation for an immigration application.

**Applicant Information:**
- Name: ${aboutYou.fullName}
- Citizenship: ${aboutYou.citizenshipCountry}
- Current Residence: ${aboutYou.currentCountry}
- Application Type: ${applicationContext.applicationType}
- Target Country: ${applicationContext.targetCountry}

**Situation to Explain:**
${explanation.mainExplanation}

${explanation.dates ? `**Relevant Dates/Events:**\n${explanation.dates}\n` : ''}
${explanation.background ? `**Additional Context:**\n${explanation.background}\n` : ''}
${emphasis ? `**Points to Emphasize:**\n${emphasis}\n` : ''}

**Tone:** ${toneInstruction}

**Requirements:**
1. Write in first person
2. Structure the letter with clear sections:
   - Introduction (brief self-introduction and purpose)
   - Background/Context (relevant history)
   - Explanation (detailed explanation of the situation)
   - Conclusion (closing statement)
3. Be factual and honest
4. Do NOT make legal claims or promises
5. Do NOT provide legal advice
6. Keep it professional and concise (500-800 words)
7. Format as a formal letter

Generate the letter now.`;
}

/**
 * Call OpenAI API to generate letter
 */
async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert immigration document writer. Generate professional, factual letters of explanation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * Call Anthropic (Claude) API to generate letter
 */
async function callAnthropic(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  logger.info('Calling Anthropic API', { 
    hasKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.substring(0, 15) + '...' : 'none'
  });
  
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

/**
 * Parse generated letter into sections
 */
function parseLetterSections(rawText: string): { heading: string; content: string }[] {
  // Simple parsing - split by common section headings
  const sections = [];
  const lines = rawText.split('\n');
  let currentSection = { heading: 'Letter', content: '' };

  for (const line of lines) {
    const trimmed = line.trim();
    // Detect section headings (lines that end with : or are all caps)
    if (trimmed.endsWith(':') || (trimmed === trimmed.toUpperCase() && trimmed.length < 30)) {
      if (currentSection.content.trim()) {
        sections.push(currentSection);
      }
      currentSection = { heading: trimmed.replace(':', ''), content: '' };
    } else {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection.content.trim()) {
    sections.push(currentSection);
  }

  return sections.length > 0 ? sections : [{ heading: 'Letter', content: rawText }];
}

/**
 * Generate immigration letter from form data
 */
export async function generateLetter(formData: FormData): Promise<GenerateLetterResult> {
  try {
    // LOG FULL DATA RECEIVED BY AI SERVICE
    logger.info('=== AI SERVICE DEBUG ===');
    logger.info('Full formData received by AI service:', {
      aboutYou: formData.aboutYou,
      applicationContext: formData.applicationContext,
      explanation: {
        mainExplanation: formData.explanation.mainExplanation.substring(0, 100) + '...',
        dates: formData.explanation.dates,
        background: formData.explanation.background?.substring(0, 50),
      },
      tone: formData.tone,
      emphasis: formData.emphasis?.substring(0, 50),
    });

    // Build prompt
    const prompt = buildPrompt(formData);
    
    // LOG THE ACTUAL PROMPT BEING SENT TO AI
    logger.info('=== PROMPT SENT TO AI ===');
    logger.info('Prompt preview (first 500 chars):', prompt.substring(0, 500));
    logger.info('Prompt length:', prompt.length);

    // Call AI (use OpenAI primary, Claude as fallback)
    let rawText: string;
    try {
      rawText = await callOpenAI(prompt);
      logger.info('Letter generated via OpenAI (gpt-4o-mini)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn('OpenAI failed, trying Claude', { error: errorMessage });
      rawText = await callAnthropic(prompt);
      logger.info('Letter generated via Claude');
    }

    // Parse into sections
    const sections = parseLetterSections(rawText);

    const document: GeneratedDocument = {
      sections,
      rawText,
      generatedAt: new Date().toISOString(),
    };

    // LOG GENERATED DOCUMENT STRUCTURE
    logger.info('=== GENERATED DOCUMENT DEBUG ===');
    logger.info('Letter generation successful', {
      wordCount: rawText.split(/\s+/).length,
      sectionCount: sections.length,
      rawTextPreview: rawText.substring(0, 200) + '...',
      sectionsPreview: sections.map(s => ({ 
        heading: s.heading, 
        contentLength: s.content.length 
      })),
    });

    return { success: true, document };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Letter generation failed', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
}
