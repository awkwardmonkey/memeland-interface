/*
//  Copyright 2021 Vircadia contributors.
//  Copyright 2022 DigiSomni LLC.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

import { MetaverseManager } from "@Modules/metaverse";
import { API } from "@Modules/metaverse/API";
import type { GetPlacesResponse } from "@Modules/metaverse/APIPlaces";
import Log, { findErrorMessage } from "@Modules/debugging/log";

export interface PlaceEntry {
    name: string;
    placeId: string;
    address: string;
    description: string;
    thumbnail: string;
    currentAttendance: number;
}

export const Places = {

    async getActiveList(): Promise<PlaceEntry[]> {
        const places: PlaceEntry[] = [];
        if (MetaverseManager.activeMetaverse?.isConnected) {
            try {
                const placesResponse = await API.get(API.endpoints.places + "?status=online") as GetPlacesResponse;

                placesResponse.places.forEach((place) => {
                    places.push({
                        name: place.name,
                        placeId: place.placeId,
                        address: place.address,
                        description: place.description,
                        thumbnail: place.thumbnail,
                        currentAttendance: place.current_attendance === undefined ? 0 : place.current_attendance
                    } as PlaceEntry);
                });
            } catch (error) {
                const errorMessage = findErrorMessage(error);
                Log.error(Log.types.PLACES, `Exception while attempting to get places: ${errorMessage}`);
            }
        } else {
            Log.error(Log.types.PLACES, "Attempt to get places when metaverse not connected");
        }

        return places;
    }
};
