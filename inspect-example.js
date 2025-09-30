// src/inspect-example.js
import { createSkyInspector } from "@statelyai/inspect";
import { createActor } from "xstate";
import { createMachine } from "xstate";

// простая тестовая машина
const machine = createMachine({
  id: "demo",
  initial: "idle",
  states: {
    idle: { on: { START: "running" } },
    running: { on: { STOP: "idle" } }
  }
});

async function start() {
  // Создаёт inspector, в Node он подключится к Sky и при подключении
  // в консоль выведет ссылку вида https://.../inspect/<sessionId>
  const inspector = createSkyInspector(/* { apiKey: '...' } */);

  // если хотите явно стартануть
  inspector.start?.();

  // создаём актор/инстанс машины и передаём inspect
  const actor = createActor(machine, {
    inspect: inspector.inspect
  });

  actor.start();

  // тестовые события
  actor.send({ type: "START" });
  setTimeout(() => actor.send({ type: "STOP" }), 3000);
}

start().catch(console.error);
