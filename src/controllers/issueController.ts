import { Request, Response } from "express";
import { IssueModel } from "../models/IssueModel";
import { ResearchModel } from "../models/ResearchModel";
import { SectionModel } from "../models/SectionModel";

export const createIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, editors, category, image, date } = req.body;

    if (!title || !editors || !category || !image) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newIssue = new IssueModel({
      title,
      editors,
      category,
      image,
      date: date || Date.now(),
    });

    await newIssue.save();

    res.status(201).json({ message: "Issue created successfully", issue: newIssue });
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ message: "Error creating issue", error });
  }
};

export const getIssuesByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;

    if (!category) {
      res.status(400).json({ message: "Category is required" });
      return;
    }
    const issues = await IssueModel.find({ category });
    res.status(200).json({ issues });
  } catch (error) {
    console.error("Error fetching issues by category:", error);
    res.status(500).json({ message: "Error fetching issues by category", error });
  }
};

export const getIssueById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Issue ID is required" });
      return;
    }

    if (id.startsWith("~")) {
      const category = id.slice(1);
      const issue = await IssueModel.findOne({ category }).sort({ date: -1 });
      if (!issue) {
        res.status(404).json({ message: "Issue not found" });
        return;
      }

      const rawSections = await SectionModel.find({ issue: issue._id });
      const sections = await Promise.all(
        rawSections.map(async (section: any) => {
          let s: any = {
            _id: section._id,
            title: section.title
          }
          s.researches = await ResearchModel.find({ section: section._id }).sort({ index: 1 });
          return s
        }))
      res.status(200).json({ details: issue, sections });
      return;
    }

    const issue = await IssueModel.findById(id)
    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }
    const rawSections = await SectionModel.find({ issue: issue._id });
    const sections = await Promise.all(
      rawSections.map(async (section: any) => {
        let s: any = {
          _id: section._id,
          title: section.title
        }
        s.researches = await ResearchModel.find({ section: section._id }).sort({ index: 1 });
        return s
    }))

    res.status(200).json({ details: issue, sections });
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ message: "Error fetching issue", error });
  }
};
  

export const updateIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, editors, category, image, date } = req.body;

    if (!id) {
      res.status(400).json({ message: "Issue ID is required" });
      return;
    }

    const updatedIssue = await IssueModel.findByIdAndUpdate(
      id,
      { title, editors, category, image, date },
      { new: true, runValidators: true }
    );

    if (!updatedIssue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    res.status(200).json({ message: "Issue updated successfully", issue: updatedIssue });
  } catch (error) {
    console.error("Error updating issue:", error);
    res.status(500).json({ message: "Error updating issue", error });
  }
};

export const deleteIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Issue ID is required" });
      return;
    }

    const deletedIssue = await IssueModel.findByIdAndDelete(id);

    if (!deletedIssue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({ message: "Error deleting issue", error });
  }
};
