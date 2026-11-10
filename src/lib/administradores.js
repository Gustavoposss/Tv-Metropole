// A interface repete a conta já gravada em private.administradores.
// Esse schema não aparece na API do portal, então o navegador não consegue
// consultar a lista. A gravação continua decidida pelas políticas do banco.
export const CONTAS_AUTORIZADAS = [
  '293f07ba-089e-431b-9437-2c5311001f41',
];

export function usuarioEhAdministrador(usuario) {
  return CONTAS_AUTORIZADAS.includes(usuario?.id);
}
