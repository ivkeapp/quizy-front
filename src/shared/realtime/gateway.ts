export type RealtimeEventMap = {
  quiz_started: { roomId: string; at: string };
  question_published: { roomId: string; questionId: number; expiresAt: string };
  answer_ranked: { roomId: string; userId: number; rank: number; responseMs: number };
};

export type RealtimeConnectionState = 'idle' | 'connecting' | 'connected' | 'disconnected';

export type RealtimeGateway = {
  connect: () => void;
  disconnect: () => void;
  state: () => RealtimeConnectionState;
};

export function createRealtimeGateway(): RealtimeGateway {
  let connectionState: RealtimeConnectionState = 'idle';

  return {
    connect: () => {
      connectionState = 'connecting';
    },
    disconnect: () => {
      connectionState = 'disconnected';
    },
    state: () => connectionState,
  };
}
