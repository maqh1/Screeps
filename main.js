var roleHarvester = require('role.Harvester');
var roleBuilder = require('role.Builder');
var roleUpgrader = require('role.Upgrader');
var config = require('config');

module.exports.loop = function () {
    // 清除已死亡的Creep内存
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // 计数每种角色的Creep数量
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    // 确定可用的能量
    var energyAvailable = Game.spawns['maqh'].room.energyAvailable;

    // 保证每种角色的数量不小于配置中的最大数量
    if (harvesters.length < config.maxHarvesters && energyAvailable >= 200) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['maqh'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } });
    } else if (builders.length < config.maxBuilders && energyAvailable >= 200) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['maqh'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'builder' } });
    } else if (upgraders.length < config.maxUpgraders && energyAvailable >= 200) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['maqh'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'upgrader' } });
    }

    // 执行每个Creep的角色任务
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep, 'maqh');
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}
