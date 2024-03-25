<script>
  import { Alert } from "flowbite-svelte";
  import { APP_STATUS, appStatus } from "../store";
  import StepUpload from "./StepUpload.svelte";
  import StepChat from "./StepChat.svelte";
  import StepLoading from "./StepLoading.svelte";
</script>

{#if $appStatus === APP_STATUS.INIT}
  <StepUpload />
{:else if $appStatus === APP_STATUS.LOADING}
  <StepLoading />
{:else if $appStatus === APP_STATUS.ERROR}
  <Alert type="error">
    <span class="font-medium">¡Alerta de error!</span>
    Hay un error en la aplicación
  </Alert>
{:else if $appStatus === APP_STATUS.CHAT_MODE}
  <StepChat />
{:else}
  <Alert type="error">
    <span class="font-medium">Acción no reconocida</span>
  </Alert>
{/if}
