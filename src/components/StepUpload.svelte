<script>
  import {
    setAppStatusLoading,
    setAppStatusError,
    setAppStatusChatMode,
  } from "../store";

  import Dropzone from "svelte-file-dropzone";

  let files = {
    accepted: [],
    rejected: [],
  };

  async function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];

    if (acceptedFiles.length > 0) {
      setAppStatusLoading();
      const formData = new FormData();
      console.log("acceptedFiles:", acceptedFiles[0]);

      formData.append("file", acceptedFiles[0]);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const r = await res.json();
      console.log("res: ", r);

      if (!res.ok) {
        setAppStatusError();
        return;
      }

      const { id, url, pages } = r;
      setAppStatusChatMode({ id, url, pages });
    }
  }
</script>

{#if files.accepted.length === 0}
  <Dropzone
    accept="application/pdf"
    multiple={false}
    on:drop={handleFilesSelect}
  >
    Arrastra y suelta tus PDF
  </Dropzone>
{/if}
<ol>
  {#each files.accepted as item}
    <li>{item.name}</li>
  {/each}
</ol>
