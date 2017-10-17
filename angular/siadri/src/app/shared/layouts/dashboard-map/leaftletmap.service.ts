import { LeafletDirective } from '@asymmetrik/ngx-leaflet/dist';
import { Injectable } from '@angular/core';

@Injectable()
export class LeaftletmapService {

leafletDirective: LeafletDirective;
constructor(leafletDirective: LeafletDirective) {
this.leafletDirective = leafletDirective;
    }

someFunction() {
if (null != this.leafletDirective.getMap()) {
	        // Do stuff with the map
}
}
}

