import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// return only active (not completed)
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tasks").collect();
    return all.filter((t) => !t.isCompleted);
  },
});

// return only completed
export const getCompleted = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tasks").collect();
    return all.filter((t) => t.isCompleted);
  },
});

// create a task
export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
    });
  },
});

// update (unchanged)
export const update = mutation({
  args: { id: v.id("tasks"), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isCompleted: args.isCompleted });
  },
});

// remove single task (unchanged)
export const removeTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// clear all completed tasks (collect ids then delete each)
export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const completed = (await ctx.db.query("tasks").collect()).filter(
      (t) => t.isCompleted
    );
    for (const t of completed) {
      await ctx.db.delete(t._id);
    }
    return { deleted: completed.length };
  },
});