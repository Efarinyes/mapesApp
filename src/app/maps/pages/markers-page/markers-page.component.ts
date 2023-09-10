import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[]
}

@Component({
  selector: 'page-markers-page',
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerAndColor[] = []


  public map?: Map;
  public currentLngLat: LngLat = new LngLat(2.434788732449192, 41.539258210792156)

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'Element HTML no trobat'

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: 15
    });
    this.readToLocalStorage();

    // Afegir marcador al mapa segons la documentació de MapBox

    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'Eduard'

    // const marker = new Marker({
    //  color: 'red',
    //  element: markerHtml
    // })
    //   .setLngLat( this.currentLngLat)
    //   .addTo(this.map)
  }

  createMarker() {
    if (!this.map) return
    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const lngLat = this.map.getCenter()

    this.addMarker(lngLat, color)
  }

  addMarker(lnglat: LngLat, color: string) {
    if (!this.map) return;
    const marker = new Marker({
      color,
      draggable: true
    })
      .setLngLat(lnglat)
      .addTo(this.map)

    this.markers.push({
      color,
      marker
    })
    this.saveToLocalStorage()
    marker.on('dragend', () => this.saveToLocalStorage() )
  }

  deleteMarker(index: number ) {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1)
    this.saveToLocalStorage()

  }

  flyTo( marker: Marker) {
    this.map?.flyTo({
      zoom: 15,
      center: marker.getLngLat()
    })
  }

  saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map( ({ color, marker }) => {

      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    });
    localStorage.setItem('plainMarkers', JSON.stringify( plainMarkers ))
  }

  readToLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]'
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString) // Compte, Perill

    plainMarkers.forEach( ({color, lngLat}) => {
      const [ lng, lat ] = lngLat
      const coords =  new LngLat(lng, lat)

      this.addMarker( coords, color)
    })
  }

}
