import { beforeAll } from "vitest";
import { setProjectAnnotations } from "@storybook/react";
import * as projectAnnotations from "./preview";

// Apply the Storybook preview annotations (decorators, global types, parameters)
// to the Vitest browser tests generated from the stories.
const project = setProjectAnnotations([projectAnnotations]);

beforeAll(project.beforeAll);
