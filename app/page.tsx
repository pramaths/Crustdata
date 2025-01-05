"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun, Send } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes";
import ApiList from '@/components/ApiList';
import ApiDetails from '@/components/ApiDetails';
import Image from 'next/image';
import Levels from '@/components/levels';

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showTasks, setShowTasks] = useState(true);
  const { theme, setTheme } = useTheme();
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const renderMessage = (message: any) => {
    return (
      <div
        className={`rounded-2xl px-4 py-2.5 ${
          message.role === 'user'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
        }`}
      >
        <div>{message.content}</div>
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
                    <ApiDetails 
                      endpoint={result}
                    />
                  </div>
                );
              }
            } else {
              return (
                <div key={toolCallId}>
                  {toolName === 'listAPIs' ? (
                    <div>Loading APIs...</div>
                  ) : toolName === 'getAPIDetails' ? (
                    <div>Loading API details...</div>
                  ) : null}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <header className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="flex items-center space-x-2">
          <Image 
            src="/crustdata.svg" 
            alt="CrustData Assistant" 
            width={60} 
            height={60} 
            className="dark:filter dark:invert"
          />
          <h1 className="text-2xl font-bold">CrustData API Assistant</h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="bg-white text-purple-600 hover:bg-gray-200 transition-colors duration-200"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
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
                  <div className={`flex items-end gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="w-16 h-16">
                      <AvatarFallback 
                        className={`text-2xl ${
                          message.role === 'user' 
                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                            : 'bg-white text-gray-900 dark:bg-gray-900 dark:text-white'
                        }`}
                      >
                        {message.role === 'user' ? 'U' : 'AI'}
                      </AvatarFallback>
                      <AvatarImage 
                        src={message.role === 'user' ? 'https://github.com/shadcn.png' : '/crustdata.svg'} 
                        className={message.role === 'assistant' ? 'dark:filter dark:invert' : ''}
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
                  <div className="flex items-end gap-3">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-2xl bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
                        AI
                      </AvatarFallback>
                      <AvatarImage src="/crustdata.svg" className="dark:filter dark:invert" />
                    </Avatar>
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl px-4 py-2.5 shadow-md">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        </ScrollArea>
      </main>

      <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white ">
        <form onSubmit={onSubmit} className="max-w-4xl mx-auto flex space-x-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about CrustData APIs..."
            className="flex-grow rounded-full bg-gray-100 dark:bg-gray-700 border-0 focus-visible:ring-2 focus-visible:ring-purple-500 h-12"
          />
          <Button 
            type="submit" 
            disabled={isTyping} 
            size="lg" 
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            <Send className="h-5 w-5 mr-2" />
            Send
          </Button>
        </form>
      </footer>
    </div>
  );
}