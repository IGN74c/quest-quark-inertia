import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Code,
    Italic,
    List,
    ListOrdered,
    Quote,
    Strikethrough,
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function RichTextEditor({
    id,
    value,
    onChange,
    placeholder,
    className,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            }),
            Placeholder.configure({
                placeholder: placeholder ?? 'Начните писать...',
            }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                id,
                class: 'tiptap-editor__content',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.isEmpty ? '' : editor.getHTML());
        },
    });

    const toolbarState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            isBold: editor.isActive('bold'),
            isItalic: editor.isActive('italic'),
            isStrike: editor.isActive('strike'),
            isBulletList: editor.isActive('bulletList'),
            isOrderedList: editor.isActive('orderedList'),
            isBlockquote: editor.isActive('blockquote'),
            isCode: editor.isActive('code'),
        }),
    });

    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        const next = value || '';
        if (current !== next) {
            editor.commands.setContent(next, false);
        }
    }, [editor, value]);

    return (
        <div className={cn('tiptap-editor space-y-2', className)}>
            <div className="flex flex-wrap gap-1 rounded-md border bg-muted/30 p-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-8 w-8',
                        toolbarState?.isBold &&
                            'bg-accent text-accent-foreground',
                    )}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    aria-label="Жирный"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-8 w-8',
                        toolbarState?.isItalic &&
                            'bg-accent text-accent-foreground',
                    )}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    aria-label="Курсив"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-8 w-8',
                        toolbarState?.isStrike &&
                            'bg-accent text-accent-foreground',
                    )}
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    aria-label="Зачеркнутый"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <div className="mx-1 h-6 w-px self-center bg-border" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-8 w-8',
                        toolbarState?.isBulletList &&
                            'bg-accent text-accent-foreground',
                    )}
                    onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                    }
                    aria-label="Маркированный список"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-8 w-8',
                        toolbarState?.isOrderedList &&
                            'bg-accent text-accent-foreground',
                    )}
                    onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                    }
                    aria-label="Нумерованный список"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-8 w-8',
                        toolbarState?.isBlockquote &&
                            'bg-accent text-accent-foreground',
                    )}
                    onClick={() =>
                        editor?.chain().focus().toggleBlockquote().run()
                    }
                    aria-label="Цитата"
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-8 w-8',
                        toolbarState?.isCode &&
                            'bg-accent text-accent-foreground',
                    )}
                    onClick={() => editor?.chain().focus().toggleCode().run()}
                    aria-label="Код"
                >
                    <Code className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-md border bg-background">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
