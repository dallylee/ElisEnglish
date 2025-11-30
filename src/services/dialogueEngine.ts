// Dialogue engine for processing branching conversation trees

import type { DialogueNode, DialogueChoice } from '../types/lesson';

export class DialogueEngine {
    private dialogueTree: DialogueNode[];
    private currentNode: DialogueNode | null = null;
    private history: DialogueNode[] = [];

    constructor(tree: DialogueNode[], startId: string) {
        this.dialogueTree = tree;
        this.currentNode = tree.find(node => node.id === startId) || null;

        if (this.currentNode) {
            this.history.push(this.currentNode);
        }
    }

    // Get current message and choices
    getCurrentState() {
        if (!this.currentNode) {
            return { message: null, choices: [], isComplete: true };
        }

        return {
            message: this.currentNode.message,
            choices: this.currentNode.choices || [],
            isComplete: !this.currentNode.choices || this.currentNode.choices.length === 0
        };
    }

    // Make a choice and move to next node
    makeChoice(choiceId: string): boolean {
        if (!this.currentNode || !this.currentNode.choices) {
            return false;
        }

        const choice = this.currentNode.choices.find(c => c.id === choiceId);
        if (!choice) {
            return false;
        }

        const nextNode = this.dialogueTree.find(node => node.id === choice.nextMessageId);
        if (!nextNode) {
            console.error('Next node not found:', choice.nextMessageId);
            return false;
        }

        this.currentNode = nextNode;
        this.history.push(nextNode);
        return true;
    }

    // Get conversation history
    getHistory(): DialogueNode[] {
        return [...this.history];
    }

    // Check if conversation is complete
    isComplete(): boolean {
        return !this.currentNode || !this.currentNode.choices || this.currentNode.choices.length === 0;
    }

    // Restart dialogue
    restart(startId: string): void {
        this.currentNode = this.dialogueTree.find(node => node.id === startId) || null;
        this.history = this.currentNode ? [this.currentNode] : [];
    }
}
