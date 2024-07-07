'use strict';

const config = {
    maxHarvesters: 5,
    maxBuilders: 3,
    maxUpgraders: 5,
    spawnName: `maqh`
};

var Method = {
    create: function (name, fn, body) {
        var newName = name + Game.time;
        Game.spawns[config.spawnName].spawnCreep(body, newName, { memory: { role: fn } });
    },
    check_and_create: function () {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var energyAvailable = Game.spawns[config.spawnName].room.energyAvailable;
        if (harvesters.length < config.maxHarvesters && energyAvailable >= 200) {
            create('Harvester', 'harvester', [WORK, CARRY, MOVE]);
        } else if (builders.length < config.maxBuilders && energyAvailable >= 200) {
            create('Builder', 'builder', [WORK, CARRY, MOVE]);
        } else if (upgraders.length < config.maxUpgraders && energyAvailable >= 200) {
            create('Upgrader', 'upgrader', [WORK, CARRY, MOVE]);
        }
    },
    remove_dead: function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    },
    run: function () {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep, config.spawnName);
            }
            if (creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
        }
    }
};

const loop  = function () {
    Method.remove_dead();
    Method.check_and_create();
    Method.run();
};

exports.loop = loop;
//# sourceMappingURL=main.js.map
