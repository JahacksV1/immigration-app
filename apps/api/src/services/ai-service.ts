import { FormData } from '../types/form';
import { GeneratedDocument } from '../types/document';
import { logger } from '../lib/logger';

interface GenerateLetterResult {
  success: boolean;
  document?: GeneratedDocument;
  error?: string;
}

function buildPrompt(formData: FormData): string {
  const { aboutYou, applicationContext, explanation, tone, emphasis, contactInfo, template } = formData;

  let toneInstruction = '';
  if (tone === 'formal') {
    toneInstruction = 'Use formal, professional language throughout.';
  } else if (tone === 'neutral') {
    toneInstruction = 'Use clear, balanced language that is professional but not overly formal.';
  } else {
    toneInstruction = 'Use warm, personal language while maintaining professionalism.';
  }

  let templateInstruction = '';
  let structureRules = '';

  if (template === 'conservative') {
    templateInstruction = 'CONSERVATIVE LEGAL TEMPLATE - Traditional formal style';
    structureRules = `
**CONSERVATIVE FORMAT RULES (MANDATORY):**
- Write 4-5 paragraphs ONLY
- Each paragraph: 5-7 sentences (DENSE, information-rich)
- NO bullet points, NO short paragraphs
- Use formal legal language: "pursuant to", "hereby", "aforementioned"
- Very structured, methodical flow`;
  } else if (template === 'modern') {
    templateInstruction = 'MODERN CONTEMPORARY TEMPLATE - Clean, scannable style';
    structureRules = `
**MODERN FORMAT RULES (MANDATORY):**
- Write 7-9 SHORT paragraphs
- Each paragraph: 2-3 sentences MAX (easy to scan)
- Contemporary language: "I'm writing to", "Here's why"
- Short, punchy sentences. Active voice, direct communication.`;
  } else {
    templateInstruction = 'PROFESSIONAL EXECUTIVE TEMPLATE - Strategic, polished style';
    structureRules = `
**PROFESSIONAL FORMAT RULES (MANDATORY):**
- Write 5-6 medium paragraphs
- Each paragraph: 3-4 sentences (balanced)
- Confident, executive language. Strategic organization: most important points first.`;
  }

  let letterHeader = '';
  if (contactInfo && (contactInfo.address || contactInfo.city || contactInfo.email || contactInfo.phone)) {
    letterHeader = '\n**Letter Header Format (Sender Information):**\n';
    letterHeader += `${aboutYou.fullName}\n`;
    if (contactInfo.address) letterHeader += `${contactInfo.address}\n`;
    if (contactInfo.city || contactInfo.state || contactInfo.zipCode) {
      const cityLine = [contactInfo.city, contactInfo.state, contactInfo.zipCode].filter(Boolean).join(', ');
      letterHeader += `${cityLine}\n`;
    }
    if (contactInfo.email) letterHeader += `${contactInfo.email}\n`;
    if (contactInfo.phone) letterHeader += `${contactInfo.phone}\n`;
    letterHeader += '\n';
  }

  return `You are an expert immigration document writer with 15+ years of experience drafting Letters of Explanation for USCIS, IRCC, and other immigration authorities.

**Applicant Information:**
- Full Name: ${aboutYou.fullName}
- Country of Citizenship: ${aboutYou.citizenshipCountry}
- Current Country of Residence: ${aboutYou.currentCountry}
- Application Type: ${applicationContext.applicationType}
${letterHeader}
**Situation Requiring Explanation:**
${explanation.mainExplanation}

${explanation.dates ? `**Timeline/Relevant Dates:**\n${explanation.dates}\n` : ''}
${explanation.background ? `**Background Context:**\n${explanation.background}\n` : ''}
${emphasis ? `**Key Points to Emphasize:**\n${emphasis}\n` : ''}

**Writing Guidelines:**
- **Tone:** ${toneInstruction}
- **Template Style:** ${templateInstruction}

${structureRules}

**Requirements:**
1. Professional business letter format with sender block, date, salutation, body, and closing
2. Content: 500-800 words, first person, specific details and concrete examples
3. Do NOT make legal claims or give legal advice

Generate a complete, professional Letter of Explanation now.`;
}

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not configured');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert immigration document writer. Generate professional, factual letters of explanation.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json() as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content.trim();
}

async function callAnthropic(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Anthropic API key not configured');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${error}`);
  }

  const data = await response.json() as { content: { text: string }[] };
  return data.content[0].text.trim();
}

function parseLetterSections(rawText: string): { heading: string; content: string }[] {
  const sections = [];
  const lines = rawText.split('\n');
  let currentSection = { heading: 'Letter', content: '' };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.endsWith(':') || (trimmed === trimmed.toUpperCase() && trimmed.length < 30)) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { heading: trimmed.replace(':', ''), content: '' };
    } else {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection.content.trim()) sections.push(currentSection);
  return sections.length > 0 ? sections : [{ heading: 'Letter', content: rawText }];
}

export async function generateLetter(formData: FormData): Promise<GenerateLetterResult> {
  try {
    const prompt = buildPrompt(formData);

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

    const sections = parseLetterSections(rawText);
    const document: GeneratedDocument = { sections, rawText, generatedAt: new Date().toISOString() };

    logger.info('Letter generation successful', {
      wordCount: rawText.split(/\s+/).length,
      sectionCount: sections.length,
    });

    return { success: true, document };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Letter generation failed', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
}
