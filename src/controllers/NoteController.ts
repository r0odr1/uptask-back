import type { Request, Response } from "express";
import Note, { INote } from "../models/Node";

export class NotedController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;

    const note = new Note();
    note.content = content;
    note.createdBy = req.user._id;
    note.task = req.task._id;

    // push the ObjectId rather than the string id getter
    req.task.notes.push(note._id);

    try {
      await Promise.allSettled([req.task.save(), note.save()]);
      res.send("Nota Creada Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Huno un error" });
    }
  };
}
