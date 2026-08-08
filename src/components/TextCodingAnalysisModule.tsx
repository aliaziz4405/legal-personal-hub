import React, { useState, useMemo } from 'react';
import { Tag, Plus, Trash2, Code, Eye, Palette, Sparkles, Check, Copy } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../i18n/translations';

interface CodingTag {
  id: string;
  label: string;
  color: string; // Tailwind bg hex or class
  description: string;
}

interface RegexRule {
  id: string;
  pattern: string;
  tagLabel: string;
  color: string;
}

interface TextCodingAnalysisModuleProps {
  language?: AppLanguage;
}

export const TextCodingAnalysisModule: React.FC<TextCodingAnalysisModuleProps> = ({
  language = 'fa',
}) => {
  const t = translations[language] || translations.fa;
  const isFa = language === 'fa';

  // Sample legal text for analysis
  const defaultLegalText = isFa
    ? `ماده ۱ - مسئولیت مدنی ناشی از حوادث وسایل نقلیه:
دارنده وسیله نقلیه مکلف است خسارت جانی و مالی وارد شده به اشخاص ثالث را جبران نماید. طبق اصل جبران کامل خسارت، هیچ زیان دیده‌ای نباید بدون جبران باقی بماند.

ماده ۲ - استثنائات مسئولیت:
خسارت ناشی از عمد زیان‌دیده یا قوه قهریه (فورسمژور) مشمول جبران خسارت نخواهد بود. دادگاه رسیدگی‌کننده با احراز قصد مجرمانه یا تقصیر سنگین می‌تواند میزان خسارت را تعدیل نماید.

Article 3 - Standard of Proof & Ratio Decidendi:
The court held that mens rea must be established beyond reasonable doubt for statutory offenses involving severe criminal penalties. Public interest doctrine applies to corporate negligence.`
    : `Article 1 - Civil Liability Standard:
The holder of a motor vehicle is obligated to compensate for personal and property damages caused to third parties. Under the principle of full reparation, no injured party shall remain uncompensated.

Article 2 - Force Majeure & Exceptions:
Damages resulting from intentional acts or force majeure shall not be compensated. The court upon establishing mens rea or gross negligence may adjust damages.

Article 3 - Ratio Decidendi & Statutory Construction:
The Supreme Court held that mens rea must be established beyond reasonable doubt for statutory offenses. Public interest doctrine applies to corporate negligence.`;

  const [rawText, setRawText] = useState<string>(defaultLegalText);

  // Custom Tags Manager
  const [tags, setTags] = useState<CodingTag[]>([
    { id: '1', label: 'اصول حقوقی / Legal Principle', color: '#10b981', description: 'Core legal doctrines & statutory principles' },
    { id: '2', label: 'رویه و رای اصلی / Ratio Decidendi', color: '#f59e0b', description: 'Binding rule of law established in judicial holding' },
    { id: '3', label: 'نکته فرعی / Obiter Dictum', color: '#8b5cf6', description: 'Persuasive comments not essential to judgment' },
    { id: '4', label: 'عنصر روانی / Mens Rea', color: '#ef4444', description: 'Subjective mental element or intentional fault' },
  ]);

  // Regex Auto-Tagging Rules
  const [regexRules, setRegexRules] = useState<RegexRule[]>([
    { id: 'r1', pattern: '\\b(ماده|Article|Section|فصل)\\s*\\d+', tagLabel: 'ارکان ساختاری', color: '#3b82f6' },
    { id: 'r2', pattern: '\\b(mens rea|مسئولیت مدنی|قوه قهریه|تقصیر)\\b', tagLabel: 'اصطلاحات کلیدی', color: '#ec4899' },
  ]);

  // New Tag Form State
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');

  // New Regex Rule Form State
  const [newRegexPattern, setNewRegexPattern] = useState('');
  const [newRegexTag, setNewRegexTag] = useState('');
  const [newRegexColor, setNewRegexColor] = useState('#10b981');

  const handleAddTag = () => {
    if (!newTagLabel.trim()) return;
    setTags((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        label: newTagLabel.trim(),
        color: newTagColor,
        description: 'Custom coding tag',
      },
    ]);
    setNewTagLabel('');
  };

  const handleRemoveTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddRegexRule = () => {
    if (!newRegexPattern.trim() || !newRegexTag.trim()) return;
    setRegexRules((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        pattern: newRegexPattern.trim(),
        tagLabel: newRegexTag.trim(),
        color: newRegexColor,
      },
    ]);
    setNewRegexPattern('');
    setNewRegexTag('');
  };

  const handleRemoveRegex = (id: string) => {
    setRegexRules((prev) => prev.filter((r) => r.id !== id));
  };

  // Highlighting text logic with Regex
  const highlightedJSX = useMemo(() => {
    if (!rawText) return null;

    let elements: { text: string; color?: string; label?: string }[] = [{ text: rawText }];

    // Apply regex rules sequentially
    regexRules.forEach((rule) => {
      try {
        const regex = new RegExp(`(${rule.pattern})`, 'gi');
        const nextElements: { text: string; color?: string; label?: string }[] = [];

        elements.forEach((chunk) => {
          if (chunk.color) {
            nextElements.push(chunk);
            return;
          }

          const parts = chunk.text.split(regex);
          parts.forEach((part) => {
            if (part && regex.test(part)) {
              nextElements.push({
                text: part,
                color: rule.color,
                label: rule.tagLabel,
              });
            } else if (part) {
              nextElements.push({ text: part });
            }
          });
        });

        elements = nextElements;
      } catch (err) {
        // Invalid regex
      }
    });

    return elements;
  }, [rawText, regexRules]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-600/20 text-pink-400 border border-pink-500/30 rounded-xl">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {isFa ? 'کدگذاری ساختاری و تحلیل گفتمان حقوقی (Text Coding & Analysis)' : 'Structural Text Coding & Critical Discourse Analysis'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa
                ? 'تحلیل متن قوانین و آراء قضایی با برچسب‌های رنگی دستی و قاعده‌گذاری عبارت‌های کلیدی (Regex).'
                : 'Workspace for manual colored tagging and automated regex term coding of raw legal documents.'}
            </p>
          </div>
        </div>
      </div>

      {/* Part 1: Visual Tag Manager with Color Picker */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-pink-400" />
          <span>{isFa ? '۱. مدیریت کدها و کدهای رنگی تحلیل حقوقی' : '1. Legal Coding Tag Manager & Palette'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: tag.color }} />
                <span className="text-xs font-bold text-slate-200 truncate">{tag.label}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Tag Form */}
        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
          <span className="text-[11px] font-bold text-slate-300">
            {isFa ? 'تعریف کد/برچسب حقوقی جدید:' : 'Create New Analysis Tag:'}
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              dir="auto"
              placeholder={isFa ? 'عنوان برچسب (مثال: تعارض قوانین)' : 'Tag Label (e.g., Conflict of Laws)'}
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 flex-1"
            />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-8 h-8 rounded border border-slate-800 bg-transparent cursor-pointer"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFa ? 'افزودن برچسب' : 'Add Tag'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Regex Terminology Auto-Tagger Rules */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Code className="w-4 h-4 text-blue-400" />
          <span>{isFa ? '۲. قواعد هایلایت خودکار عبارت‌ها با عبارت باقاعده (Regex Rules)' : '2. Regex Terminology Auto-Tagging Rules'}</span>
        </h4>

        <div className="space-y-2">
          {regexRules.map((rule) => (
            <div
              key={rule.id}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: rule.color }} />
                <span className="text-slate-300 font-bold">[{rule.tagLabel}]</span>
                <span className="text-slate-500">Pattern:</span>
                <code className="text-pink-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{rule.pattern}</code>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveRegex(rule.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Regex Form */}
        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
          <span className="text-[11px] font-bold text-slate-300">
            {isFa ? 'افزودن قاعده Regex جدید جهت‌هایلایت خودکار:' : 'Add Custom Regex Auto-Highlight Rule:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              dir="ltr"
              placeholder="Regex Pattern (e.g. \b(Article|ماده)\b)"
              value={newRegexPattern}
              onChange={(e) => setNewRegexPattern(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono text-left"
            />
            <input
              type="text"
              dir="auto"
              placeholder="Tag Name (e.g. Statutory Delimiter)"
              value={newRegexTag}
              onChange={(e) => setNewRegexTag(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
            />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newRegexColor}
                onChange={(e) => setNewRegexColor(e.target.value)}
                className="w-8 h-8 rounded border border-slate-800 bg-transparent cursor-pointer"
              />
              <button
                type="button"
                onClick={handleAddRegexRule}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 w-full justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFa ? 'افزودن قاعده' : 'Add Rule'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: Interactive Workspace for Raw Text Analysis */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span>{isFa ? '۳. محیط کارگاهی تحلیل متن سند حقوقی' : '3. Text Analysis & Coding Workspace'}</span>
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor Input */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              {isFa ? 'متن خامی که می‌خواهید تحلیل شود:' : 'Raw Legal Text Input:'}
            </label>
            <textarea
              rows={12}
              dir="auto"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-sans leading-relaxed focus:border-pink-500 focus:outline-none custom-scrollbar"
            />
          </div>

          {/* Rendered Live Coded Text View */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              {isFa ? 'پیش‌نمایش زنده با کدگذاری و هایلایت‌های رنگی:' : 'Live Coded Output Preview:'}
            </label>
            <div className="w-full h-[225px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 leading-relaxed font-sans overflow-y-auto whitespace-pre-wrap custom-scrollbar select-text">
              {highlightedJSX ? (
                highlightedJSX.map((chunk, idx) =>
                  chunk.color ? (
                    <mark
                      key={idx}
                      className="px-1 py-0.5 rounded text-slate-950 font-bold mx-0.5"
                      style={{ backgroundColor: chunk.color }}
                      title={chunk.label}
                    >
                      {chunk.text}
                    </mark>
                  ) : (
                    <span key={idx}>{chunk.text}</span>
                  )
                )
              ) : (
                <span className="text-slate-500 italic">No text provided.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
