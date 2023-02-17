<template>
  <div v-if="!this.waitSignCode"
    class="wrapperhrefs">
    <div>
      <TextCustom 
        customColor="darkblue1"
        customFontSize="small_bold"
        display="block">
        Verifique as regras de estágio para o seu curso:
      </TextCustom>
    </div>
    <div class="divhref">
      <HrefCustom
        id="cchref"
        customColor="lightblue"
        customFontSize="small"
        href="https://facom.ufu.br/graduacao/bcc/estagio-supervisionado">
        Ciência da Computação
      </HrefCustom>
    </div>
    <div class="divhref">
      <HrefCustom
        id="sihref"
        customColor="lightblue"
        customFontSize="small"
        href="https://facom.ufu.br/legislacoes/normas-de-estagio-curricular-do-bacharelado-em-sistemas-de-informacao">
        Sistemas de Informação
      </HrefCustom>
    </div>
  </div>
</template>
