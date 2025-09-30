"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    full_name: string;
    role: string;
  };
}

interface Project {
  id: string;
  title: string;
  status: string;
}

export default function ProjectMessagesPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    loadData();
    setupRealtimeSubscription();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadData = async () => {
    try {
      const { user } = await authClient.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { profile } = await authClient.getProfile(user.id);
      if (!profile || profile.role !== "client") {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      const supabase = createSupabaseBrowserClient();

      // Load project
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("id, title, status")
        .eq("id", projectId)
        .eq("client_id", user.id)
        .single();

      if (projectError) {
        console.error("Error loading project:", projectError);
        return;
      }

      setProject(projectData);

      // Load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select(`
          *,
          profiles:sender_id (
            id,
            full_name,
            role
          )
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Error loading messages:", messagesError);
      } else {
        setMessages(messagesData?.map(m => ({
          ...m,
          sender: m.profiles
        })) || []);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const supabase = createSupabaseBrowserClient();
    
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          // Load the new message with sender info
          const { data: newMessageData } = await supabase
            .from("messages")
            .select(`
              *,
              profiles:sender_id (
                id,
                full_name,
                role
              )
            `)
            .eq("id", payload.new.id)
            .single();

          if (newMessageData) {
            setMessages(prev => [...prev, {
              ...newMessageData,
              sender: newMessageData.profiles
            }]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !project) return;

    setSending(true);

    try {
      const supabase = createSupabaseBrowserClient();
      
      const { error } = await supabase
        .from("messages")
        .insert({
          project_id: projectId,
          sender_id: user.id,
          content: newMessage.trim()
        });

      if (error) {
        console.error("Error sending message:", error);
        return;
      }

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Proyecto no encontrado</p>
          <Link href="/dashboard/client">
            <Button className="mt-4">Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                IngWork
              </Link>
              <span className="ml-4 text-gray-500">Mensajes - {project.title}</span>
            </div>
            <Link href={`/dashboard/client/projects/${projectId}`}>
              <Button variant="outline" size="sm">
                ← Volver al Proyecto
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes aún</h3>
              <p className="text-gray-600">Inicia la conversación enviando el primer mensaje</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender.id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender.id === user.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${
                      message.sender.id === user.id ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      {message.sender.full_name}
                    </span>
                    <span className={`text-xs ${
                      message.sender.id === user.id ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {message.sender.role === 'client' ? 'Cliente' : 'Ingeniero'}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender.id === user.id ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" disabled={sending || !newMessage.trim()}>
              {sending ? "..." : "Enviar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
