"use client";

// =============================================================================
// RichTextEditor
// =============================================================================
// A reusable TipTap-based rich text editor for the admin dashboard. It supports
// headings, lists, blockquote, code, links, images, underline, alignment, and
// HTML cleanup on output. Images can be inserted either via URL or by
// opening the MediaLibrary picker (Cloudinary).
// =============================================================================

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Link as LinkIcon,
  Link2Off,
  Image as ImageIcon,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Pilcrow,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MediaPicker, type MediaAsset } from "./media-picker";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  /** Optional folder to scope Cloudinary uploads to (e.g. `blog-content`). */
  uploadFolder?: string;
  /** Min height of the editor content area in pixels. */
  minHeight?: number;
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-8 w-8 inline-flex items-center justify-center rounded-md text-sm transition-colors",
        "hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        active && "bg-muted text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-border mx-1" />;
}

interface LinkPopoverProps {
  editor: Editor;
}

function LinkPopover({ editor }: LinkPopoverProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(editor.getAttributes("link").href ?? "");

  useEffect(() => {
    if (open) {
      setUrl(editor.getAttributes("link").href ?? "");
    }
  }, [open, editor]);

  const apply = () => {
    const href = url.trim();
    if (!href) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href })
        .run();
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span>
          <ToolbarButton
            title="Insert link"
            active={editor.isActive("link")}
            onClick={() => setOpen((v) => !v)}
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
            }}
            autoFocus
          />
          <Button type="button" size="sm" onClick={apply}>
            Apply
          </Button>
        </div>
        {editor.isActive("link") && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start"
            onClick={() => {
              editor.chain().focus().unsetLink().run();
              setOpen(false);
            }}
          >
            <Link2Off className="h-4 w-4 mr-2" />
            Remove link
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface ImagePopoverProps {
  editor: Editor;
  onPickFromLibrary: () => void;
}

function ImagePopover({ editor, onPickFromLibrary }: ImagePopoverProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const apply = () => {
    const href = url.trim();
    if (!href) return;
    editor
      .chain()
      .focus()
      .setImage({ src: href, alt: alt.trim() || undefined })
      .run();
    setUrl("");
    setAlt("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span>
          <ToolbarButton title="Insert image" onClick={() => setOpen((v) => !v)}>
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-3 space-y-2" align="start">
        <div className="flex gap-2">
          <Input
            placeholder="Image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
            }}
            autoFocus
          />
          <Button type="button" size="sm" onClick={apply}>
            Insert
          </Button>
        </div>
        <Input
          placeholder="Alt text (for accessibility)"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
        />
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            setOpen(false);
            onPickFromLibrary();
          }}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Pick from Media Library
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className,
  uploadFolder,
  minHeight = 240,
}: RichTextEditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const lastEmittedHtml = useRef<string>(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: { HTMLAttributes: { class: "tiptap-codeblock" } },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: "tiptap-image" },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "tiptap prose prose-sm sm:prose-base max-w-none focus:outline-none",
        style: `min-height: ${minHeight}px;`,
        "aria-label": "Rich text editor",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      lastEmittedHtml.current = html;
      onChange(html);
    },
  });

  // Sync external value -> editor (e.g. when a remote blog post is loaded).
  useEffect(() => {
    if (!editor) return;
    if (value !== lastEmittedHtml.current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
      lastEmittedHtml.current = value;
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          "rounded-md border border-input bg-background",
          "min-h-[160px] flex items-center justify-center text-sm text-muted-foreground",
          className,
        )}
      >
        Loading editor...
      </div>
    );
  }

  const handleMediaPicked = (asset: MediaAsset) => {
    editor
      .chain()
      .focus()
      .setImage({
        src: asset.url,
        alt: asset.publicId,
      })
      .run();
  };

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background overflow-hidden",
        className,
      )}
    >
      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Formatting"
        className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1.5"
      >
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          title="Paragraph"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          title="Bulleted list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <LinkPopover editor={editor} />
        <ImagePopover
          editor={editor}
          onPickFromLibrary={() => setPickerOpen(true)}
        />
        <ToolbarButton
          title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
        <div className="ml-auto flex items-center gap-0.5">
          <ToolbarButton
            title="Undo"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Redo"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor surface */}
      <EditorContent editor={editor} />

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={handleMediaPicked}
        folder={uploadFolder}
        title="Pick an image for the article"
      />
    </div>
  );
}

export default RichTextEditor;
