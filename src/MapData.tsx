export interface Root {
    version: number
    generator: string
    osm3s: Osm3s
    elements: MapElement[]
}

export interface Osm3s {
    timestamp_osm_base: string
    timestamp_areas_base: string
    copyright: string
}

export interface MapElement {
    type: string
    id: number
    lat?: number
    lon?: number
    tags: Tags
    center?: Center
    nodes?: number[]
}

export interface Tags {
    access?: string
    "addr:city"?: string
    "addr:housenumber"?: string
    "addr:postcode"?: string
    "addr:state"?: string
    "addr:street"?: string
    amenity?: string
    bicycle?: string
    brand: string
    "brand:wikidata": string
    capacity?: string
    motorcar?: string
    name: string
    opening_hours?: string
    operator?: string
    "operator:wikidata"?: string
    "operator:wikipedia"?: string
    short_name?: string
    "socket:tesla_supercharger"?: string
    "tesla:ref"?: string
    website?: string
    "socket:tesla_supercharger:output"?: string
    fee?: string
    addr?: string
    "addr:country"?: string
    "addr:housename"?: string
    covered?: string
    charge?: string
    "payment:app"?: string
    "not:brand:wikidata"?: string
    "addr:place"?: string
    bus?: string
    hgv?: string
    level?: string
    network?: string
    "parking:fee"?: string
    scooter?: string
    description?: string
    "payment:credit_cards"?: string
    "addr:description"?: string
    "socket:tesla_supercharger:power"?: string
    note?: string
    start_date?: string
    "charging_station:output"?: string
    "socket:tesla_supercharger_ccs"?: string
    "socket:tesla_supercharger_ccs:output"?: string
    address?: string
    "addr:full"?: string
    image?: string
    "charge:conditional"?: string
    indoor?: string
    lit?: string
    "addr:floor"?: string
    "level:ref"?: string
    "authentication:none"?: string
    phone?: string
    shop?: string
    check_date?: string
    toilets?: string
    "addr:county"?: string
    "brand:website"?: string
    "payment:cash"?: string
    "payment:debit_cards"?: string
    "contact:phone"?: string
    ref?: string
    source?: string
    "source:name"?: string
    "payment:contactless"?: string
    building?: string
    building_type?: string
    "sangis:OBJECTID"?: string
    "sangis:TYPE"?: string
    "toilets:wheelchair"?: string
    wheelchair?: string
    changing_table?: string
    "toilets:access"?: string
    "building:levels"?: string
    "roof:colour"?: string
    "roof:shape"?: string
    "addr:unit"?: string
    height?: string
    source_ref?: string
    air_conditioning?: string
    "lacounty:ain"?: string
    "lacounty:bld_id"?: string
    ele?: string
    "building:material"?: string
    "building:use"?: string
    "check_date:opening_hours"?: string
    "opening_hours:signed"?: string
    organic?: string
    wikidata?: string
}

export interface Center {
    lat: number
    lon: number
}
