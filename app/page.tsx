"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast"
import ApiList from '@/components/ApiList';
import ApiDetails from '@/components/ApiDetails';
import CodeBlock from '@/components/CodeBlock';
import Image from 'next/image';
import Levels from '@/components/levels';

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showTasks, setShowTasks] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      toast({
        variant: "destructive",
        title: "Empty message",
        description: "Please enter a message before sending.",
      });
      return;
    }

    setIsTyping(true);
    setShowTasks(false);
    try {
      await handleSubmit(e);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (message: any) => {
    const parts = message.content.split(/(```[\s\S]*?```)/g);
    return (
      <div
        className={`rounded-2xl px-4 py-2.5 ${
          message.role === 'user'
            ? 'bg-zinc-800 text-white'
            : 'bg-zinc-900 text-white'
        }`}
      >
        {parts.map((part: string, index: number) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const [, language, code] = part.match(/```(\w+)?\n([\s\S]+)```/) || [];
            return <CodeBlock key={index} code={code} language={language || 'plaintext'} />;
          }
          return <div key={index}>{part}</div>;
        })}
        <div>
          {message.toolInvocations?.map((toolInvocation: any) => {
            const { toolName, toolCallId, state, result } = toolInvocation;

            if (state === 'result') {
              if (toolName === 'listAPIs') {
                return (
                  <div key={toolCallId}>
                    <ApiList 
                      apis={result} 
                      onSelectApi={(apiName) => {
                        const e = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
                        handleInputChange({ target: { value: `Tell me about the ${apiName} API` } } as React.ChangeEvent<HTMLInputElement>);
                        handleSubmit(e);
                      }}
                    />
                  </div>
                );
              }
              if (toolName === 'getAPIDetails') {
                return (
                  <div key={toolCallId}>
                    <ApiDetails endpoint={result} />
                  </div>
                );
              }
            }
            return (
              <div key={toolCallId} className="text-gray-400">
                {toolName === 'listAPIs' ? 'Loading APIs...' : toolName === 'getAPIDetails' ? 'Loading API details...' : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="flex justify-between items-center p-4 bg-black text-white">
        <div className="flex items-center space-x-2">
          <Image
            src="/crustdata.svg"
            alt="CrustData Assistant"
            width={150}
            height={150}
            className="invert"
          />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <AnimatePresence>
              {showTasks && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Levels showTasks={showTasks} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6 mt-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-center gap-3 max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className={`${message.role === 'user' ? 'w-8 h-8' : 'w-8 h-8'}`}>
                      <AvatarFallback className="text-white bg-zinc-800">
                        {message.role === 'user' ? 'U' : 'AI'}
                      </AvatarFallback>
                      <AvatarImage
                        src={message.role === 'user' ? 'https://github.com/shadcn.png' : '/chatgpt.png'}
                        className={message.role === 'assistant' ? 'invert' : ''}
                      />
                    </Avatar>
                    {renderMessage(message)}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-white bg-zinc-800">AI</AvatarFallback>
                      <AvatarImage src="/chatgpt.png" className="invert" />
                    </Avatar>
                    <div className="bg-zinc-900 rounded-2xl px-4 py-2.5">
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        </ScrollArea>
      </main>

      <footer className="p-4 bg-black">
        <div className="max-w-3xl mx-auto mb-4">
          <p className="text-zinc-400 text-sm mb-2">Example queries:</p>
          <div className="flex flex-wrap gap-2">
            {['Can u list down all the API available', 'How to use the User API?', 'What are the authentication methods can u provide me code?'].map((query, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={async() => {
                  handleInputChange({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>);
                  await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 bg-black"
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
        <form onSubmit={onSubmit} className="max-w-3xl mx-auto flex space-x-3 items-center">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about CrustData APIs..."
            className="flex-grow rounded-full bg-zinc-900 text-white border-0 focus-visible:ring-1 focus-visible:ring-zinc-700 h-12"
          />
          <Button
            type="submit"
            disabled={isTyping}
            size="lg"
            className="rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-all duration-200 h-12"
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </footer>
    </div>
  );
}

