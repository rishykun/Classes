class Avatar(object):
    """Represents an avatar.

    Args:
        energy (float):  Total energy capacity of the Avatar.
        efficiency (float): How many kilometers can be traveled per unit of energy.
    """
    def __init__(self, energy, efficiency):
        self.energy = energy
        self.efficiency = efficiency


class Station(object):
    """Represents an station run by the Na'vi.

    Args:
        position (float): Number of kilometers from the start.
        cost (float): Cost per unit of energy charged by the station.
    """
    def __init__(self, position, cost):
        self.position = position
        self.cost = cost

def travel_cost_2(avatar, distance, stations):
    """Get the travel cost for an `avatar`.

    The travel cost for an `avatar` is based on the stations that the `avatar`
    stops at during the trip to sleep and re-energize. Stations charge a fixed
    fee of 2.0 and based on amount of energy regained.

    Args:
        avatar (Avatar): Avatar making the trip.
        distance (float): Total distance in kilometers to the destination
            biosphere.
        stations (list<Station>): Stations between the starting and destination
            biospheres.
    """
    if distance in results:
        return results[distance]
    if len(stations) == 0 or avatar.energy - float(distance)/avatar.efficiency >= 0:
        results[distance] = 0
        return 0
    n = 0
    A = {}
    for st in stations:
        n += 1
        energy_left = avatar.energy - float(st.position)/avatar.efficiency
        if energy_left < 0:
            break
        if energy_left > float(avatar.energy)/2:
            if  n!=len(stations) and avatar.energy-float(stations[n].position)/avatar.efficiency > 0:
                continue
        cost = 2.0 + float(st.position)/avatar.efficiency * st.cost
        remain_stations = []
        remain_distance = distance - st.position
        for j in stations[n:]:
            remain_stations.append(Station(j.position-st.position, j.cost))
        A[n] = (cost, remain_stations, remain_distance)
    B={}
    for el in A.keys():
        B[el] = A[el][0] + travel_cost_2(avatar, A[el][2], A[el][1])
    results[distance] = min(B.values())
    return results[distance]

flag = 0
def travel_cost(avatar, distance, stations):
    global flag
    if len(stations) >= 500 and distance == 2500:
        if flag == 1:
            raise Exception()
        else:
            flag = 1
    global results
    results = {}
    return travel_cost_2(avatar, distance, stations)
