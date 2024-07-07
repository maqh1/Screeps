import { Method } from './method';

export const loop  = function () {
    Method.remove_dead();
    Method.check_and_create();
    Method.run();
}
