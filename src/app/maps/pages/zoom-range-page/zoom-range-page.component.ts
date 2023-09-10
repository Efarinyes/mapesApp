import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { LngLat, Map } from 'mapbox-gl';

@Component({
  selector: 'page-zoom-range',
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy  {


  @ViewChild('map') divMap?: ElementRef;

  public zoom: number = 10
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(2.442625142006534, 41.528796917341964)

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'Element HTML no trobat'

      this.map = new Map({
      container: this.divMap.nativeElement , // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
      });

      this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove()
  }

  mapListeners() {
    if (!this.map) throw 'Mapa no inicialitzat';

    this.map.on('zoom', (ev)=> {
      this.zoom = this.map!.getZoom();
    })

    this.map.on('zoomend', (ev)=> {
      if (this.map!.getZoom() < 20 ) return;
      this.map!.zoomTo(20)

    })

    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter()
      const { lng, lat } = this.currentLngLat
    })
  }

  zoomIn() {
    this.map?.zoomIn()
  }

  zoomOut() {
    this.map?.zoomOut()
  }

  zoomChanged( value: string) {
    this.zoom = Number(value)
    this.map?.zoomTo(this.zoom)
  }

}
