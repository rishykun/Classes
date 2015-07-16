from binary_trees import AVLTree
class Point(object):
    """Represents a point in 2-d space.

    You may change this class but do not change __init__().

    Attributes:
        x: An integer representing the x coordinate.
        y: An integer representing the x coordinate.
    """

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        """Return a string containing a printable representation of an object."""
        return 'Point(%s, %s)' % (self.x, self.y)


class Bridge(object):
    """Represents a bridge in 2-d space.

    A bridge can be thought of as a line segment from start to end.

    You may change this class but do not change __init__().

    Attributes:
        start: A Point representing the start coordinates.
        end: A Point representing the end coordinates.
    """

    def __init__(self, start, end):
        self.start = start
        self.end = end

    def __repr__(self):
        """Return a string containing a printable representation of an object."""
        return 'Bridge(%s, %s)' % (self.start, self.end)

    def line(self,x):
        return float(self.end.y-self.start.y)/(self.end.x-self.start.x) *(x-self.start.x) +self.start.y

    def slope(self):
        return float(self.end.y-self.start.y)/(self.end.x-self.start.x)
        

def traverse(layout):
    """Get the number of possible bridges traversed.

    Given a list of `bridges`, will return the total number of bridges that can
    be traversed if the traversal starts at (0, 0).  A bridge will be traversed
    fully until the end and which point the traverser will fall downward onto
    the next bridge or plummit into the abyss.  Bridges will be strictly
    increasing in the x and y directions and will never touch.

    Args:
        layout (list): List of Bridge objects representing a possible layout of
            the Hesiod world.

    Returns:
        int: Maximum number of bridges traversed following conditions above.

    """
    bridgelist = []

    dic = {}
    j=[]
    for i in layout:
        dic[(i.start.x, i.start.y)] = i
        j.append((i.start.x, i.start.y))
    j.sort()
    layout=[]
    for i in j:
        layout.append(dic[i])
    layoutc=layout[:]
    for bridge in layoutc:
        if bridge.start.x == 0 and bridge.start.y==0:
            initbridge = bridge
            break
        else:
            layout.pop(0)
    currentgoodbridge=initbridge
    bridgelist.append(initbridge)
    while True:
        Tree = AVLTree()
        layoutc = layout[:]
        for i in layoutc:
            if i.start.x <= currentgoodbridge.end.x and i.start.y > currentgoodbridge.line(i.start.x):
                layout.pop(layout.index(i))
            elif i.start.x <= currentgoodbridge.end.x:
                if i.end.x > currentgoodbridge.end.x:
                    n = currentgoodbridge.end.y - i.line(currentgoodbridge.end.x)
                    Tree.insert(n, i)
                    if layoutc.index(i) == len(layoutc) - 1:
                        m = Tree.min_item()
                        currentgoodbridge = m[1]
                        bridgelist.append(currentgoodbridge)
                        #print bridgelist
                        return len(bridgelist)
                else:
                    if layoutc.index(i) == len(layoutc) - 1:
                        if len(Tree) ==0:
                            return len(bridgelist)
                        m = Tree.min_item()
                        currentgoodbridge = m[1]
                        bridgelist.append(currentgoodbridge)
                        #print bridgelist
                        return len(bridgelist)
                    layout.pop(layout.index(i))
            elif i.start.x > currentgoodbridge.end.x or layout.index(i)==len(layout)-1:
                if len(Tree) == 0:
                    flag = True
                    return len(bridgelist)
                m=Tree.min_item()
                currentgoodbridge = m[1]
                bridgelist.append(currentgoodbridge)
                break
    #print bridgelist
    return len(bridgelist)
                
                
