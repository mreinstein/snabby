// Inits with common modules out of the box
// Also easier to use across multiple files
import create               from './create.js'
import containerQueryModule from './snabbdom-containerquery.js'
import { attributesModule, classModule, propsModule, styleModule, eventListenersModule } from 'snabbdom'


export default create([
    attributesModule,
    eventListenersModule,
    classModule,
    propsModule,
    styleModule,
    containerQueryModule
])
