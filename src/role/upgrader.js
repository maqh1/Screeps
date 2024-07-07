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

export { roleUpgrader };