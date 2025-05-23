import { codeDeckExtension, sourceDeckExtension } from "src/conf/constants";
import { Card } from "src/entities/card";
import { AnkiNote } from "../types/anki";

export class Clozecard extends Card {
  constructor(
    id = -1,
    deckName: string,
    initialContent: string,
    fields: Record<string, string>,
    reversed: boolean,
    initialOffset: number,
    endOffset: number,
    tags: string[] = [],
    inserted = false,
    mediaNames: string[],
    containsCode: boolean
  ) {
    super(
      id,
      deckName,
      initialContent,
      fields,
      reversed,
      initialOffset,
      endOffset,
      tags,
      inserted,
      mediaNames,
      containsCode
    );
    this.modelName = `Obsidian-cloze`;
    if (fields["Source"]) {
      this.modelName += sourceDeckExtension;
    }
    if (containsCode) {
      this.modelName += codeDeckExtension;
    }
  }

  public getCard(update = false): AnkiNote {
    const card: AnkiNote = {
      deckName: this.deckName,
      modelName: this.modelName,
      fields: this.fields,
      tags: this.tags,
    };

    if (update) {
      card["id"] = this.id;
    }

    return card;
  }

  public getMedias(): object[] {
    const medias: object[] = [];
    this.mediaBase64Encoded.forEach((data, index) => {
      medias.push({
        filename: this.mediaNames[index],
        data: data,
      });
    });

    return medias;
  }

  public toString = (): string => {
    return `Cloze: ${this.fields[0]}`;
  };

  public getIdFormat(): string {
    return `<!-- ankiID: ${this.id} -->`;
  }
}
