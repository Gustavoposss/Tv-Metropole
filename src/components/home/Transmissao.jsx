import { useState } from 'react';
import LivePlayer from '../LivePlayer';
import { Badge, Card, LiveBadge } from '../ui';
import ProgramaAtual from './ProgramaAtual';

export default function Transmissao({ status, programa, onTentar }) {
  const [player, setPlayer] = useState('carregando');

  return (
    <Card className="shadow-md">
      <div className="relative">
        <LivePlayer incorporar onEstado={setPlayer} />
        <div className="pointer-events-none absolute left-3 top-3 z-30 flex flex-wrap items-center gap-2 sm:left-4 sm:top-4">
          {player === 'reproduzindo' ? <LiveBadge>Ao Vivo</LiveBadge> : null}
          <Badge variant="overlay">Canal 16.1 HD</Badge>
        </div>
      </div>
      <ProgramaAtual status={status} programa={programa} onTentar={onTentar} />
    </Card>
  );
}
