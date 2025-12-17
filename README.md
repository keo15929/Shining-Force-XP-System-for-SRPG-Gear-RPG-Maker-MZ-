Shining Force XP System Plugin for RPG Maker MZ
A custom experience system inspired by Shining Force 1, built for SRPG Gear and RPG Maker MZ.
This plugin replaces the default XP logic with a proportional, damage‑based system that rewards strategy, positioning, and consistent contribution — just like the classic tactical RPGs.
A faithful Shining Force–style leveling system built for SRPG Gear. **Version:** 1.0.0
✨ Features
- Damage‑based XP
Gain experience proportional to the damage dealt, not fixed values.
- Kill bonus logic
Award extra XP for finishing blows (optional, depending on your system).
- Supports healing, buffs, and utility actions
(If your plugin does this — I’ll adjust once you confirm.)
- Fully compatible with SRPG Gear
Designed specifically for tactical grid‑based combat.
- Easy to customize
XP curves, multipliers, and class modifiers can be adjusted in the plugin parameters.

📥 Installation
- Download the plugin .js file from this repository.
- Place it in your project’s js/plugins/ folder.
- Open RPG Maker MZ → Plugin Manager.
- Add the plugin and enable it.
- Configure parameters as needed.

⚙️ How It Works
This plugin overrides SRPG Gear’s default experience calculation and applies a Shining Force–style formula:
- XP gained is based on damage dealt vs. target max HP
- Minimum XP ensures weak hits still feel rewarding
- Kill xp equals 48
- Optional class‑based multipliers
- Level‑difference scaling
- Static 100xp to level up

🧪 Compatibility
- ✅ RPG Maker MZ
- ✅ SRPG Gear
- ✅ Custom battle systems that rely on SRPG Gear’s hooks
- ⚠️ May conflict with other plugins that modify XP gain


