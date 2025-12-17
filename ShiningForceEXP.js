/*:
 * @target MZ
 * @plugindesc [SRPG] Shining Force Leveling 
 * @author Keith OSteen
 * @help 
 * 1. Add <level:X> to Enemy Note tags (MANDATORY).
 * 2. Add <promoted> to Note tags of any Promoted Class.
 */

(function() {
    "use strict";

    // 1. Force 100 XP to level up
    Game_Actor.prototype.nextRequiredExp = function() { return 100; };
    Game_Actor.prototype.expForLevel = function(level) { return (level - 1) * 100; };

    // 2. Main Battle Logic
    var _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.call(this, target);
        
        if (this.subject() && this.subject().isActor() && $gameSystem.isSRPGMode()) {
            var subject = this.subject();
            var result = target.result();
            var earnedExp = 0;
            var displayMsg = "";

            // --- PROMOTED LEVEL CALCULATION ---
            var currentClass = subject.currentClass();
            var effectiveLvl = subject.level;
            if (currentClass.meta && currentClass.meta.promoted) {
                effectiveLvl += 20; // A Promoted Lvl 1 is treated as Lvl 21
            }

            // --- TARGET LEVEL DETECTION ---
            var targetLvl = 1;
            if (target.isEnemy()) {
                // Ensure we are pulling the level from the meta tag correctly
                targetLvl = Number(target.enemy().meta.level) || 1;
            } else if (target.isActor()) {
                targetLvl = target.level;
                // If the target of a heal is promoted, they also count as +20 for the healer's gain
                if (target.currentClass().meta && target.currentClass().meta.promoted) {
                    targetLvl += 20;
                }
            }

            var levelDiff = targetLvl - effectiveLvl;
            var scale = Math.pow(1.15, levelDiff);

            // --- XP CALCULATIONS ---

            // CASE A: Healing
            if (this.isRecover()) {
                var healAmt = Math.abs(result.hpDamage);
                var healPct = healAmt / Math.max(target.mhp, 1);
                earnedExp = (healPct * 25) * scale;
                displayMsg = subject.name() + " healed " + target.name() + "! ";
            }
            // CASE B: Items
            else if (this.isItem()) {
                earnedExp = 1;
                displayMsg = subject.name() + " used an item. ";
            }
            // CASE C: Attacking
            else if (this.isDamage() && result.hpDamage > 0 && target.isEnemy()) {
                var dmg = result.hpDamage;
                var hpPct = dmg / Math.max(target.mhp, 1);
                earnedExp = (hpPct * 48) * scale;

                if (target.hp <= 0 || target.isDead()) {
                    var killTotal = 48 * scale;
                    if (earnedExp < killTotal) earnedExp = killTotal;
                    displayMsg = subject.name() + " defeated enemy! ";
                } else {
                    displayMsg = subject.name() + " hit! ";
                }
            }

            // --- THE "SHINING FORCE" HARD LIMITS ---
            var finalExp = Math.floor(earnedExp);

            // If the Actor is 10+ levels higher than the target, they get exactly 1 XP
            // This is what prevents the "Promoted Lvl 1 vs Lvl 1 Mob" from giving 8 XP
            if (levelDiff <= -10) {
                finalExp = 1;
            } else {
                // Otherwise, enforce standard caps
                finalExp = Math.max(1, Math.min(finalExp, 99));
            }

            // Apply XP
            subject.gainExp(finalExp);

            // Final Message
            if (finalExp > 0 && displayMsg !== "") {
                displayMsg += " +" + finalExp + " EXP";
                $gameMessage.setBackground(1);
                $gameMessage.setPositionType(1);
                $gameMessage.add(displayMsg);
            }
        }
    };

    // --- LEVEL UP WINDOW ---
    var _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function() {
        var oldStats = { mhp: this.mhp, mmp: this.mmp, atk: this.atk, def: this.def };
        _Game_Actor_levelUp.call(this);

        if ($gameSystem.isSRPGMode()) {
            var message = " \\C" + this.name() + " leveled up!\\C";
            message += "\\nHP: " + oldStats.mhp + " -> " + this.mhp + "  MP: " + oldStats.mmp + " -> " + this.mmp;
            message += "\\nATK: " + oldStats.atk + " -> " + this.atk + "  DEF: " + oldStats.def + " -> " + this.def;
            $gameMessage.setBackground(0);
            $gameMessage.setPositionType(2);
            $gameMessage.add(message);
        }
    };


})();
