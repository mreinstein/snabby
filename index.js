// Inits with common modules out of the box
// Also easier to use across multiple files
import create from './create.js'
import { attributesModule } from 'https://cdn.jsdelivr.net/npm/snabbdom@2.1.0/build/package/modules/attributes.js';
import { classModule } from 'https://cdn.jsdelivr.net/npm/snabbdom@2.1.0/build/package/modules/class.js';
import { propsModule } from 'https://cdn.jsdelivr.net/npm/snabbdom@2.1.0/build/package/modules/props.js';
import { styleModule } from 'https://cdn.jsdelivr.net/npm/snabbdom@2.1.0/build/package/modules/style.js';
import { eventListenersModule } from 'https://cdn.jsdelivr.net/npm/snabbdom@2.1.0/build/package/modules/eventlisteners.js';


export default create([
    attributesModule,
    eventListenersModule,
    classModule,
    propsModule,
    styleModule
])
