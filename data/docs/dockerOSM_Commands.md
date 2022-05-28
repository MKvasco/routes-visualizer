# For importing region data to local database files 
docker run \
-e THREADS=8 \
-e "OSM2PGSQL_EXTRA_ARGS=-C 8096" \
-v /Users/kvasco/Documents/projects/bkp-osm-archive-2022/regions/slovakia-latest.osm.pbf:/data/region.osm.pbf \
-v /Users/kvasco/Documents/projects/bkp-osm-archive-2022/db/osm:/data/database/ \
overv/openstreetmap-tile-server \
import

# For importing region data to docker volumes database file
docker run \
-e THREADS=8 \
-e "OSM2PGSQL_EXTRA_ARGS=-C 8096" \
-v /Users/kvasco/Documents/projects/bkp-osm-archive-2022/regions/slovakia-latest.osm.pbf:/data/region.osm.pbf \
-v osm-data:/data/database/ \
overv/openstreetmap-tile-server \
import

# For running osm with docker volumes and caching
docker run \
-p 8080:80 \
-p 5432:5432 \
-e THREADS=8 \
-e "OSM2PGSQL_EXTRA_ARGS=-C 8096" \
-v osm-tiles:/data/tiles/ \
-v osm-data:/data/database/ \
overv/openstreetmap-tile-server \
run


# For running osm with local files and caching
docker run \
-p 8080:80 \
-p 5432:5432 \
-e THREADS=8 \
-e "OSM2PGSQL_EXTRA_ARGS=-C 8096" \
-v /users/kvasco/documents/projects/bkp-osm-archive-2022/db/tiles:/data/tiles/ \
-v /users/kvasco/documents/projects/bkp-osm-archive-2022/db/osm:/data/database/ \
overv/openstreetmap-tile-server \
run
