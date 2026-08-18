# ChatGPT mobile video evidence

## Prepared responsive-web demo

`docs/assets/chatgpt-app-demo.mp4` is a 1080x1920, 25 fps, H.264 portrait video
captured from a real signed-in ChatGPT web conversation at a 390x844 responsive
viewport. It shows a direct Atlarium compatibility tool call, the real Habitat
Explorer v4 result, species imagery, the verdict, attention points and
recommended actions.

This artifact proves the responsive widget flow inside the ChatGPT web host. It
must not be described as a native iOS or Android recording.

## Native capture checkpoint

Record the equivalent flow in the ChatGPT iOS or Android app before final App
submission:

1. Enable the Atlarium draft or approved connector and start a clean chat.
2. Start the operating-system screen recorder in portrait orientation.
3. Send: `Usa direttamente check_species_compatibility per Corydoras paleatus e Betta splendens in una vasca piantumata da 90 L a 24 C e pH 6.8, con language it. Mostra soltanto il risultato Atlarium.`
4. Keep the tool invocation and initial widget render visible, then scroll slowly
   through the two species, `Punti di attenzione` and `Azioni consigliate`.
5. Stop after 30–45 seconds. Do not show notifications, account data or unrelated
   conversations.
6. Export a portrait H.264 MP4. Preserve the ChatGPT host chrome so the recording
   is unambiguously native-host evidence.

Replace the prepared responsive-web demo only if the native recording is clean,
complete and explicitly identified as iOS or Android evidence.
