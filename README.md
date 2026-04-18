# left-sidebar

A [Zenbu](https://github.com/zenbu-labs/zenbu) plugin that injects a left sidebar into the chat view listing your past user messages, so you can see at a glance what you've been asking about.

## What it does

- Wraps the chat view (`views/chat/App.tsx`'s `ChatContent`) with an `around` advice that renders a 220px sidebar as a left sibling of the existing chat layout.
- Reads the current agent's `eventLog` collection from the kernel DB, filters for `user_prompt` events, and renders each as a small rounded card styled like the chat's user message bubble.
- Messages are chronological (oldest on top), pinned to the bottom when the list is short, and autoscroll to the newest message when a new one arrives.
- Skips injection when the chat view is mounted as a minimap or inside another sidebar (`?minimap=true` / `?sidebar=true`).

## Install

1. Clone next to your Zenbu checkout:
   ```sh
   cd ~/.zenbu/plugins
   git clone https://github.com/zenbu-labs/left-sidebar
   ```
2. Run setup (writes `tsconfig.local.json` with the right paths and installs deps):
   ```sh
   bash left-sidebar/setup.sh
   ```
3. Add the manifest to `~/.zenbu/config.jsonc`:
   ```jsonc
   {
     "plugins": [
       // ...existing entries
       "/Users/you/.zenbu/plugins/left-sidebar/zenbu.plugin.json"
     ]
   }
   ```

Zenbu hot-reloads on config change, so no restart is needed.

## Layout

```
src/
  services/left-sidebar.ts      # registers the advice
  renderer/ChatContentAdvice.tsx # the wrapper + sidebar UI
zenbu.plugin.json
setup.sh
```

The service targets `chat` scope, module `views/chat/App.tsx`, function `ChatContent`, type `around`.
