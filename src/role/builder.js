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

module.exports = roleBuilder;
