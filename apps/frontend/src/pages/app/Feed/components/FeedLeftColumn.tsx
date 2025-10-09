import { WhoToFollowCard } from './WhoToFollowCard'

const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarahjdev',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Full-stack developer | React enthusiast',
    isVerified: true
  },
  {
    id: '2',
    name: 'Mike Chen',
    username: 'mikechen',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'UI/UX Designer | Creating beautiful experiences',
    isVerified: false
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    username: 'emilyrod',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Tech writer | Python & AI',
    isVerified: true
  },
  {
    id: '4',
    name: 'James Wilson',
    username: 'jwilson',
    avatar: 'https://i.pravatar.cc/150?img=13',
    bio: 'DevOps Engineer | Cloud architecture',
    isVerified: false
  },
  {
    id: '5',
    name: 'Sophia Lee',
    username: 'sophialee',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Product Manager | Building great products',
    isVerified: true
  },
  {
    id: '6',
    name: 'David Martinez',
    username: 'davidm',
    avatar: 'https://i.pravatar.cc/150?img=14',
    bio: 'Mobile developer | iOS & Android',
    isVerified: false
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    username: 'lisaanderson',
    avatar: 'https://i.pravatar.cc/150?img=10',
    bio: 'Data Scientist | ML & Analytics',
    isVerified: true
  },
  {
    id: '8',
    name: 'Ryan Thomas',
    username: 'ryanthomas',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: 'Backend Engineer | Node.js specialist',
    isVerified: false
  }
]

export function FeedLeftColumn() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold px-4 pt-4">Who to Follow</h2>
      
      <div className="space-y-3 px-4">
        {mockUsers.map((user) => (
          <WhoToFollowCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

