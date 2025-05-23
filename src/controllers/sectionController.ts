import { Request, Response } from "express";
import { SectionModel } from "../models/SectionModel";
import { IssueModel } from "../models/IssueModel";
import { ResearchModel } from "../models/ResearchModel";

export const addSection = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, title } = req.body;
  
      if (!id) {
        res.status(400).json({ message: "Issue ID is required" });
        return;
      }
  
      const issue = await IssueModel.findById(id);
  
      if (!issue) {
        res.status(404).json({ message: "Issue not found" });
        return;
      }
  
      const newSection = new SectionModel({ title, issue: issue._id });
      const savedSection = await newSection.save();
  
      res.status(201).json({ message: "Section added successfully", section: savedSection });
    } catch (error) {
      console.error("Error adding section:", error);
      res.status(500).json({ message: "Error adding section", error });
    }
}

export const updateSection = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, title } = req.body;
  
      if (!id) {
        res.status(400).json({ message: "Section ID is required" });
        return;
      }
  
      const section = await SectionModel.findById(id);
  
      if (!section) {
        res.status(404).json({ message: "Section not found" });
        return;
      }
  
      const updatedSection = await SectionModel.findByIdAndUpdate(
        id,
        { title },
        { new: true }
      );
  
      res.status(200).json({ message: "Section updated successfully", section: updatedSection });
    } catch (error) {
      console.error("Error updating section:", error);
      res.status(500).json({ message: "Error updating section", error });
    }
}

export const deleteSection = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      if (!id) {
        res.status(400).json({ message: "Section ID is required" });
        return;
      }

      const researches = await ResearchModel.find({ section: id });
      if (researches.length > 0) {
        await ResearchModel.deleteMany({ section: id });
      }
  
      const deletedSection = await SectionModel.findByIdAndDelete(id);
  
      if (!deletedSection) {
        res.status(404).json({ message: "Section not found" });
        return;
      }
  
      res.status(200).json({ message: "Section deleted successfully" });
    } catch (error) {
      console.error("Error deleting section:", error);
      res.status(500).json({ message: "Error deleting section", error });
    }
}