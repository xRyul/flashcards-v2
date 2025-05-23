// /gui/settings-tab.ts
import { Notice, PluginSettingTab, Setting } from "obsidian";
import { Anki } from "src/services/anki";
import { escapeRegExp } from "src/utils";

export class SettingsTab extends PluginSettingTab {
  display(): void {
    const { containerEl } = this;
    const plugin = (this as any).plugin;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Default deck name")
      .setDesc(
        "The name of the default deck where the cards will be added when not specified."
      )
      .addText((text) => {
        text
          .setValue(plugin.settings.deck)
          .setPlaceholder("Deck::sub-deck")
          .onChange((value) => {
            if (value.length) {
              plugin.settings.deck = value;
              plugin.saveData(plugin.settings);
            } else {
              new Notice("The deck name must be at least 1 character long");
            }
          });
      });

    new Setting(containerEl)
      .setName("Flashcards #tag")
      .setDesc(
        "The tag to identify the flashcards in the notes (case-insensitive). Default is #card"
      )
      .addText((text) => {
        text
          .setValue(plugin.settings.flashcardsTag)
          .setPlaceholder("Card")
          .onChange((value) => {
            if (value) {
              plugin.settings.flashcardsTag = value.toLowerCase();
              plugin.saveData(plugin.settings);
            } else {
              new Notice("The tag must be at least 1 character long");
            }
          });
      });

    new Setting(containerEl)
      .setName("Inline card separator")
      .setDesc(
        "The separator to identify the inline cards in the notes."
      )
      .addText((text) => {
        text
          .setValue(plugin.settings.inlineSeparator)
          .setPlaceholder("::")
          .onChange((value) => {
            // if the value is empty or is the same like the inlineseparatorreverse then set it to the default, otherwise save it
            if (value.trim().length === 0 || value === plugin.settings.inlineSeparatorReverse) {
              plugin.settings.inlineSeparator = "::";
              if (value.trim().length === 0) {
                new Notice("The separator must be at least 1 character long");
              } else if (value === plugin.settings.inlineSeparatorReverse) {
                new Notice("The separator must be different from the inline reverse separator");
              }
            } else {
              plugin.settings.inlineSeparator = escapeRegExp(value.trim());
              new Notice("The separator has been changed");
            }
            plugin.saveData(plugin.settings);
          });
      });


    new Setting(containerEl)
      .setName("Inline reverse card separator")
      .setDesc(
        "The separator to identify the inline reverse cards in the notes."
      )
      .addText((text) => {
        text
          .setValue(plugin.settings.inlineSeparatorReverse)
          .setPlaceholder(":::")
          .onChange((value) => {
            // if the value is empty or is the same like the inlineseparatorreverse then set it to the default, otherwise save it
            if (value.trim().length === 0 || value === plugin.settings.inlineSeparator) {
              plugin.settings.inlineSeparatorReverse = ":::";
              if (value.trim().length === 0) {
                new Notice("The separator must be at least 1 character long");
              } else if (value === plugin.settings.inlineSeparator) {
                new Notice("The separator must be different from the inline separator");
              }
            } else {
              plugin.settings.inlineSeparatorReverse = escapeRegExp(value.trim());
              new Notice("The separator has been changed");
            }
            plugin.saveData(plugin.settings);
          });
      });


    new Setting(containerEl)
      .setName("Default Anki tag")
      .setDesc("This tag will be added to each generated card in Anki.")
      .addText((text) => {
        text
          .setValue(plugin.settings.defaultAnkiTag)
          .setPlaceholder("Anki tag")
          .onChange((value) => {
            if (!value) new Notice("No default tags will be added");
            plugin.settings.defaultAnkiTag = value.toLowerCase();
            plugin.saveData(plugin.settings);
          });
      });

    // General settings (no heading as per guidelines)
    new Setting(containerEl)
      .setName("Show heading path")
      .setDesc("Add the path of headings above the card to the question (e.g., Chapter > Section > Question).")
      .addToggle((toggle) =>
        toggle.setValue(plugin.settings.contextAwareMode).onChange((value) => {
          plugin.settings.contextAwareMode = value;
          plugin.saveData(plugin.settings);
        })
      );

    new Setting(containerEl)
      .setName("Include backlink")
      .setDesc(
        "Add backlink to be able to navigate back from the card in Anki to the original card in Obsidian. NOTE: Old cards made without source support cannot be updated."
      )
      .addToggle((toggle) =>
        toggle.setValue(plugin.settings.sourceSupport).onChange((value) => {
          plugin.settings.sourceSupport = value;
          plugin.saveData(plugin.settings);
        })
      );

    new Setting(containerEl)
      .setName("Code highlighting support")
      .setDesc("Add highlight of the code in Anki.")
      .addToggle((toggle) =>
        toggle
          .setValue(plugin.settings.codeHighlightSupport)
          .onChange((value) => {
            plugin.settings.codeHighlightSupport = value;
            plugin.saveData(plugin.settings);
          })
      );

    new Setting(containerEl)
      .setName("Folder-based deck name")
      .setDesc("Use current note folder as deck name in Anki.")
      .addToggle((toggle) =>
        toggle.setValue(plugin.settings.folderBasedDeck).onChange((value) => {
          plugin.settings.folderBasedDeck = value;
          plugin.saveData(plugin.settings);
        })
      );

    // Anki connection section
    new Setting(containerEl).setName('Anki connection').setHeading();

    const description = createFragment()
    description.append(
      "This needs to be done only one time. Open Anki and click the button to grant permission.",
      createEl('br'),
      'Be aware that AnkiConnect must be installed.',
    )

    new Setting(containerEl)
      .setName("Give permission")
      .setDesc(description)
      .addButton((button) => {
        button.setButtonText("Grant permission").onClick(() => {

          new Anki().requestPermission().then((result) => {
            if (result.permission === "granted") {
              plugin.settings.ankiConnectPermission = true;
              plugin.saveData(plugin.settings);
              new Notice("Anki Connect permission granted");
            } else {
              new Notice("AnkiConnect permission not granted");
            }
          }).catch((error) => {
            new Notice("Something went wrong, is Anki open?");
            console.error(error);
          });
        });
      });


    new Setting(containerEl)
      .setName("Test Anki")
      .setDesc("Test that connection between Anki and Obsidian actually works.")
      .addButton((text) => {
        text.setButtonText("Test").onClick(() => {
          new Anki()
            .ping()
            .then(() => new Notice("Anki works"))
            .catch(() => new Notice("Anki is not connected"));
        });
      });
  }
}
