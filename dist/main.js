'use strict';

const config = {
    maxHarvesters: 5,
    maxBuilders: 3,
    maxUpgraders: 5
};

var roleHarvester = {
    run: function(creep, spawn_name) {
        // 如果Creep有空余容量
        if(creep.store.getFreeCapacity() > 0) {
            // 找到最近的能量源
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(source) {
                // 尝试收集资源，如果不在范围内则移动到该资源点
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            // 如果Creep满载能量
            var spawn = Game.spawns[spawn_name];
            if(spawn) {
                // 尝试将能量传输到Spawn，如果不在范围内则移动到Spawn
                if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

var roleBuilder = {
    run: function(creep) {
        // 如果Creep在建造并且能量耗尽，则切换到收集模式
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        // 如果Creep不在建造并且能量已满，则切换到建造模式
        if(!creep.memory.building && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        // 如果Creep在建造模式
        if(creep.memory.building) {
            // 找到最近的工地
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target) {
                // 尝试建造，如果不在范围内则移动到该工地
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        // 否则，进入收集模式
        else {
            // 找到最近的能量点
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(source) {
                // 尝试收集资源，如果不在范围内则移动到该资源点
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {

        // 如果Creep在升级并且能量耗尽，则切换到采集模式
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {  
            creep.memory.upgrading = false; 
            creep.say('🔄 harvest');
	    }
        // 如果Creep不在升级并且能量已满，则切换到升级模式
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {  
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

        // 如果Creep在升级模式
	    if(creep.memory.upgrading) { 
            // 尝试升级控制器，如果不在范围内则移动到控制器
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {  // 否则进入采集模式
            // 找到最近的能量源
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(source) {
                // 尝试收集资源，如果不在范围内则移动到该资源点
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
	}
};

const loop  = function () {
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
};

exports.loop = loop;
//# sourceMappingURL=main.js.map
