export type RealtimeEventMap = {
  quiz_started: { roomId: string; at: string };
  question_published: { roomId: string; questionId: number; expiresAt: string };
  answer_ranked: { roomId: string; userId: number; rank: number; responseMs: number };
};

export function createRealtimeGateway() {
  return {
    connect: () => undefined,
    disconnect: () => undefined,
  };
}
