'use strict';

const config = {
    maxHarvesters: 5,
    maxBuilders: 3,
    maxUpgraders: 5,
    spawnName: `maqh`
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
            Method.create('Harvester', 'harvester', [WORK, CARRY, MOVE]);
        } else if (builders.length < config.maxBuilders && energyAvailable >= 200) {
            Method.create('Builder', 'builder', [WORK, CARRY, MOVE]);
        } else if (upgraders.length < config.maxUpgraders && energyAvailable >= 200) {
            Method.create('Upgrader', 'upgrader', [WORK, CARRY, MOVE]);
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
