export interface MetricItem {
  label: string;
  value: string;
  detail?: string;
}

export interface SummaryTableData {
  title?: string;
  headers: string[];
  rows: string[][];
}

export interface ActionButtonItem {
  label: string;
  action: string;
  params?: any;
}

export interface RichMessageBlock {
  type: 'text' | 'metric-grid' | 'summary-table' | 'action-buttons';
  content?: string;
  metrics?: MetricItem[];
  table?: SummaryTableData;
  buttons?: ActionButtonItem[];
}

export function parseRichMessage(text: string): RichMessageBlock[] {
  if (!text) return [];

  const blocks: RichMessageBlock[] = [];
  const regex = /:::(metric-grid|summary-table|action-buttons)\n([\s\S]*?)\n:::/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text preceding this rich block
    if (match.index > lastIndex) {
      const precedingText = text.substring(lastIndex, match.index).trim();
      if (precedingText) {
        blocks.push({ type: 'text', content: precedingText });
      }
    }

    const blockType = match[1];
    const rawJson = match[2].trim();

    try {
      const parsed = JSON.parse(rawJson);
      if (blockType === 'metric-grid' && Array.isArray(parsed)) {
        blocks.push({ type: 'metric-grid', metrics: parsed });
      } else if (blockType === 'summary-table' && parsed.headers && parsed.rows) {
        blocks.push({ type: 'summary-table', table: parsed });
      } else if (blockType === 'action-buttons' && Array.isArray(parsed)) {
        blocks.push({ type: 'action-buttons', buttons: parsed });
      } else {
        blocks.push({ type: 'text', content: rawJson });
      }
    } catch (e) {
      // If JSON parse fails, fallback to rendering as text
      blocks.push({ type: 'text', content: rawJson });
    }

    lastIndex = regex.lastIndex;
  }

  // Trailing text
  if (lastIndex < text.length) {
    const trailingText = text.substring(lastIndex).trim();
    if (trailingText) {
      blocks.push({ type: 'text', content: trailingText });
    }
  }

  // If no rich blocks matched at all, return full text
  if (blocks.length === 0 && text.trim()) {
    blocks.push({ type: 'text', content: text });
  }

  return blocks;
}
