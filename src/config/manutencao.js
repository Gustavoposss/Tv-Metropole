// A variável VITE_ é gravada no build. Sem ela, ou com qualquer valor
// diferente de "true", o portal atual permanece no ar.
// Não liga nem desliga a produção na hora: só vale depois de um novo build.
export const MODO_MANUTENCAO = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
