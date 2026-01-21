import { DateTime } from 'luxon';

export class ChicagoDateHelper {
    private static readonly ZONE = 'America/Chicago';

    // tiempo actual en ZONE
    static now() {
        return DateTime.now().setZone(this.ZONE);
    }

    
}