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

module.exports = roleHarvester;
