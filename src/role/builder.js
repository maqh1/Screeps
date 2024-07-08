const roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // 如果Creep在修复并且能量耗尽，则切换到收集模式
        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        // 如果Creep不在修复并且能量已满，则切换到修复模式
        if(!creep.memory.repairing && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            creep.memory.repairing = true;
            creep.say('🔧 repair');
        }

        // 如果Creep在修复模式
        if(creep.memory.repairing) {
            // 找到最近的需要修复的建筑
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure => structure.hits < structure.hitsMax
            });

            if(target) {
                // 尝试修复，如果不在范围内则移动到该建筑
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // 如果没有需要修复的建筑，切换到建造模式（如果需要的话）
                const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(constructionSite) {
                    if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
        // 否则，进入收集模式
        else {
            // 找到最近的能量点
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(source) {
                // 尝试收集资源，如果不在范围内则移动到该资源点
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

export { roleBuilder };